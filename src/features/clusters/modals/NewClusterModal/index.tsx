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
import { ArrowRight, Plus, PlusIcon } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { NewClusterInfo, useCreateNewClusterMutation } from '@/features/clusters/hooks/useCreateNewCluster';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/react-query/constants';
import InfoForm from '@/features/clusters/modals/NewClusterModal/InfoForm';
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
import { Input } from '@/components/ui/input';

// type RegionInfo = {
// 	region: string;
// 	cloudProvider: string;
// 	count: number;
// };

const RegionFormInputs = ({ control, index, remove }) => {
	// This component will render the fields for each region in the field array
	return (
		<div>
			<FormField
				control={control}
				name={`regions.${index}.region`}
				render={({ field: regionField }) => (
					<FormItem>
						<FormLabel>Region {index + 1}</FormLabel>
						<FormControl>
							<Input type="text" placeholder="Region" {...regionField} className="max-w-64" />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name={`regions.${index}.cloudProvider`}
				render={({ field: cloudProviderField }) => (
					<FormItem>
						<FormLabel>Cloud Provider</FormLabel>
						<FormControl>
							<Select onValueChange={cloudProviderField.onChange} {...cloudProviderField}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select Cloud Provider" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="linode">Linode</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name={`regions.${index}.count`}
				render={({ field: countField }) => (
					<FormItem>
						<FormLabel>Count</FormLabel>
						<FormControl>
							<Input
								type="number"
								placeholder="Count"
								{...countField}
								className="max-w-64"
								min={0} // Ensure count is non-negative
								onChange={(e) => {
									countField.onChange(Number(e.target.value)); // Convert the value to a number
								}}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			{/* remove button */}
			<Button
				type="button"
				variant="destructive"
				onClick={() => {
					remove(); // Call the remove function passed from the parent component to remove this region
				}}
			>
				Remove
			</Button>
		</div>
	);
};

// TODO: consolidate this with the storage size options in the NewInstanceModal
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

const NewClusterSchema = z.object({
	clusterName: z.string({
		message: 'Please enter a cluster name.',
	}),
	clusterTag: z.string({
		message: 'Please enter a cluster prefix.',
	}),
	// cloudProvider: z.enum(['aws', 'linode', 'self-hosted', 'none'], {
	// 	required_error: 'Please select an option.',
	// }),
	instanceTypes: z.string({
		required_error: 'Please select an instance type.',
	}),
	storage: z.string({
		required_error: 'Please select a storage size.',
	}),
	regions: z
		.array(
			z.object({
				region: z.string().nonempty('Region is required.'),
				cloudProvider: z.string().nonempty('Cloud Provider is required.'),
				count: z.number().min(0, 'Count must be non-negative.').min(1, 'Count must be at least 1.'),
			})
		)
		.optional(),
});

function NewClusterModal({ orgId }: { orgId: string }) {
	const queryClient = useQueryClient();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const form = useForm({
		resolver: zodResolver(NewClusterSchema),
		defaultValues: {
			clusterName: '',
			clusterTag: '',
			regions: [], // Initialize regions as an empty array
		},
	});
	const fieldArray = useFieldArray({
		control: form.control,
		name: 'regions', // This is the name of the field array
	});

	// const [regionList, setRegionList] = useState<RegionInfo[]>();

	const { data: instanceTypes } = useQuery(getInstanceTypeOptions());
	const { mutate: submitNewClusterData } = useCreateNewClusterMutation();

	// const typeOptions = [
	// 	{ value: 'aws', label: '', icon: <img src={awsLogo} alt="AWS Logo" className="size-8" /> },
	// 	{
	// 		value: 'linode',
	// 		label: 'Linode',
	// 		icon: <img src="/HDBDogOnly.svg" alt="harper systems logo" className="size-8" />,
	// 	},
	// 	{
	// 		value: 'self-hosted',
	// 		label: 'Self-Hosted',
	// 		icon: <img src="/HDBDogOnly.svg" alt="harper systems logo" className="size-8" />,
	// 	},
	// 	{ value: 'none', label: 'None', icon: <MonitorUp className="size-4" /> },
	// ];

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
						{/* <FormField
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
						/> */}
						<FormField
							control={form.control}
							name="instanceTypes"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="pb-1">Instance Type</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} {...field}>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select Instance Type" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{instanceTypes?.map((type) => (
														<SelectItem key={type.id} value={type.id}>
															{type.id}
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
						{/* TODO: consolidate this with the storage size options in the NewInstanceModal */}
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
						<section>
							{/* TODO -  Regions component List component goes here */}
							{fieldArray.fields.length > 0 ? (
								fieldArray.fields.map((field, index) => (
									<RegionFormInputs
										key={field.id} // Use the unique id provided by fieldArray
										control={form.control}
										index={index}
										remove={() => {
											// Remove the region from the field array
											fieldArray.remove(index);
										}}
									/>
								))
							) : (
								<p>No regions added yet.</p>
							)}
							<Button
								type="button"
								variant="positive"
								className="rounded-full"
								onClick={() => {
									fieldArray.append({ region: '', cloudProvider: '', count: 0 });
								}}
							>
								<PlusIcon />
								Add a Region
							</Button>
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
