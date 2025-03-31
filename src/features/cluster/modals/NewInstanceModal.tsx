import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/react-query/constants';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { NewInstanceInfo, useCreateNewInstanceMutation } from '@/features/cluster/hooks/useCreateNewInstance';

// TODO: consolidate this with the storage size options in the NewClusterModal
const storageSizeOptions = [
	{ value: '1', label: '1GB' },
	{ value: '10', label: '10GB' },
	{ value: '100', label: '100GB' },
	{ value: '250', label: '250GB' },
	{ value: '500', label: '500GB' },
	{ value: '1000', label: '1TB' },
	{ value: '1500', label: '1.5TB' },
	{ value: '2000', label: '2TB' },
	{ value: '2500', label: '2.5TB' },
	{ value: '3000', label: '3TB' },
	{ value: '3500', label: '3.5TB' },
	{ value: '4000', label: '4TB' },
	{ value: '4500', label: '4.5TB' },
	{ value: '5000', label: '5TB' },
];

const NewInstanceSchema = z.object({
	name: z.string({
		message: 'Please enter a instance name.',
	}),
	instanceTypeId: z.string({
		message: 'Please enter a instance type id.',
	}),
	url: z.string({
		message: 'Please enter a host url.',
	}),
	storage: z.string({
		message: 'Please enter a storage value.',
	}),
});

function NewInstanceModal({ clusterId }: { clusterId: string }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const form = useForm({
		resolver: zodResolver(NewInstanceSchema),
		defaultValues: {
			name: '',
			instanceTypeId: '',
			url: '',
			storage: '',
		},
	});

	const { mutate: submitNewInstanceData } = useCreateNewInstanceMutation();
	const queryClient = useQueryClient();

	const submitForm = async (formData: { name: string; instanceTypeId: string; storage: string }) => {
		Object.assign(formData, { clusterId });
		//@ts-expect-error - storage is a number but the form value is a string
		formData.storage = parseInt(formData.storage);
		const updatedFormData = {
			clusterId,
			...formData,
		} as unknown as NewInstanceInfo;
		submitNewInstanceData(updatedFormData, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: [queryKeys.cluster, clusterId], refetchType: 'active' });
				setIsModalOpen(false);
			},
		});
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DialogTrigger asChild>
				<Button variant="positive" className="rounded-full w-full md:w-44">
					<Plus /> New Instance
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a New Instance</DialogTitle>
					<DialogDescription>Create a new instance here.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submitForm)} className="grid gap-6 text-white">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="pb-1">Instance Name</FormLabel>
									<FormControl>
										<Input type="text" placeholder="ex. test-instance-1" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="instanceTypeId"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="pb-1">Instance Type ID</FormLabel>
									<FormControl>
										<Input type="text" placeholder="ex. typ-2" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="pb-1">Url</FormLabel>
									<FormControl>
										<Input type="text" placeholder="ex. typ-2" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* TODO: consolidate this with the storage size options in the NewClusterModal */}
						<FormField
							control={form.control}
							name="storage"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="pb-1">Storage Size</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} {...field}>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select Storage Size" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Storage Size</SelectLabel>
													{storageSizeOptions.map((option, index) => (
														<SelectItem key={index} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit" variant="submit" className="rounded-full">
								Create New Instance <ArrowRight />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default NewInstanceModal;
