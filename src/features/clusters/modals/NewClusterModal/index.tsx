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
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/react-query/constants';
import InfoForm from '@/features/clusters/modals/NewClusterModal/InfoForm';
import { RadioButtonGroup } from '@/components/RadioButtonGroup';
import awsLogo from '@/assets/aws_logo.svg';

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
});

function NewClusterModal({ orgId }: { orgId: string }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const form = useForm({
		resolver: zodResolver(NewClusterSchema),
		defaultValues: {
			clusterName: '',
			clusterTag: '',
		},
	});

	const { mutate: submitNewClusterData } = useCreateNewClusterMutation();
	const queryClient = useQueryClient();

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
