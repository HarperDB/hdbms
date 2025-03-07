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

const NewInstanceSchema = z.object({
	name: z.string({
		message: 'Please enter a instance name.',
	}),
	instanceTypeId: z.string({
		message: 'Please enter a instance type id.',
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
				<Button variant="positive" className="rounded-full md:w-44">
					{' '}
					<Plus /> New Cluster
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a New Cluster</DialogTitle>
					<DialogDescription>Create a new cluster here.</DialogDescription>
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
										<Input type="text" placeholder="ex. type-2" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
													<SelectItem value="1">1GB</SelectItem>
													<SelectItem value="10">10GB</SelectItem>
													<SelectItem value="100">100GB</SelectItem>
													<SelectItem value="250">250GB</SelectItem>
													<SelectItem value="500">500GB</SelectItem>
													<SelectItem value="1000">1TB</SelectItem>
													<SelectItem value="1500">1.5TB</SelectItem>
													<SelectItem value="2000">2TB</SelectItem>
													<SelectItem value="2500">2.5TB</SelectItem>
													<SelectItem value="3000">3TB</SelectItem>
													<SelectItem value="3500">3.5TB</SelectItem>
													<SelectItem value="4000">4TB</SelectItem>
													<SelectItem value="4500">4.5TB</SelectItem>
													<SelectItem value="5000">5TB</SelectItem>
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
