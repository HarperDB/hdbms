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
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, MonitorUp, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { NewClusterInfo, useCreateNewClusterMutation } from '@/features/clusters/hooks/useCreateNewCluster';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/react-query/constants';
import InfoForm from '@/features/clusters/modals/NewClusterModal/InfoForm';
import { RadioButtonGroup } from '@/components/RadioButtonGroup';
import awsLogo from '@/assets/aws_logo.svg';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
} from '@/components/ui/select';
import { getInstanceTypeOptions } from '@/features/cluster/queries/getInstanceTypeQuery';

const NewClusterSchema = z.object({
	clusterName: z.string({
		message: 'Please enter a cluster name.',
	}),
	clusterTag: z.string({
		message: 'Please enter a cluster prefix.',
	}),
	cloudProvider: z.enum(['aws', 'linode', 'self-hosted', 'none'], {
		required_error: 'Please select an option.',
	}),
	storage: z.string({
		required_error: 'Please select a storage size.',
	}),
});

function NewClusterModal({ orgId }: { orgId: string }) {
	const queryClient = useQueryClient();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const form = useForm({
		resolver: zodResolver(NewClusterSchema),
		defaultValues: {
			clusterName: '',
			clusterTag: '',
		},
	});

	const { data: instanceTypes, isInstanceTypesLoading } = useQuery(getInstanceTypeOptions());
	console.log('Instance Types:', instanceTypes);
	const { mutate: submitNewClusterData } = useCreateNewClusterMutation();

	const typeOptions = [
		{ value: 'aws', label: '', icon: <img src={awsLogo} alt="AWS Logo" className="size-8" /> },
		{
			value: 'linode',
			label: 'Linode',
			icon: <img src="/HDBDogOnly.svg" alt="harper systems logo" className="size-8" />,
		},
		{
			value: 'self-hosted',
			label: 'Self-Hosted',
			icon: <img src="/HDBDogOnly.svg" alt="harper systems logo" className="size-8" />,
		},
		{ value: 'none', label: 'None', icon: <MonitorUp className="size-4" /> },
	];

	const submitForm = async (formData: { clusterName: string; clusterTag: string }) => {
		console.log('Form submitted with data:', formData);
		const updatedFormData = {
			organizationId: orgId,
			...formData,
		} as NewClusterInfo;
		submitNewClusterData(updatedFormData, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: [queryKeys.organization], refetchType: 'active' });
				setIsModalOpen(false);
			},
		});
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DialogTrigger asChild>
				<Button variant="positive" className="rounded-full w-full md:w-44">
					<Plus /> New Cluster
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>Create a New Cluster</DialogTitle>
					<DialogDescription>Create a new cluster here.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submitForm)} className="grid gap-6 text-white">
						<InfoForm />
						<section>
							<FormField
								control={form.control}
								name="cloudProvider"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cloud Provider</FormLabel>
										<FormControl>
											<RadioButtonGroup options={typeOptions} control={form.control} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</section>
						<section>
							{/* Get instance type from api call and populate dropdown */}
							{/* <FormField
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
														{instanceTypes?.map((type) => (
															<SelectItem key={type.value} value={type.value}>
																{type.label}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/> */}
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
						</section>
						<DialogFooter>
							<Button type="submit" variant="submit" className="rounded-full">
								Create New Cluster <ArrowRight />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default NewClusterModal;
