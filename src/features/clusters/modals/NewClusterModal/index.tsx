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
import { ArrowRight, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { NewClusterInfo, useCreateNewClusterMutation } from '@/features/clusters/hooks/useCreateNewCluster';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/react-query/constants';
import InfoForm from '@/features/clusters/modals/NewClusterModal/InfoForm';
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group';

const NewClusterSchema = z.object({
	clusterName: z.string({
		message: 'Please enter a cluster name.',
	}),
	clusterTag: z.string({
		message: 'Please enter a cluster prefix.',
	}),
	type: z.enum(['aws', 'linode', 'self-hosted', 'none'], {
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

	const submitForm = async (formData: { clusterName: string; clusterTag: string }) => {
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
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a New Cluster</DialogTitle>
					<DialogDescription>Create a new cluster here.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submitForm)} className="grid gap-6 text-white">
						<InfoForm />
						<section>
							<h2 className="font-semibold">Cloud Provider</h2>
							<hr className="my-2" />
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormLabel>Notify me about...</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="flex flex-col space-y-1"
											>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="aws" />
													</FormControl>
													<FormLabel className="font-normal">AWS</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="linode" />
													</FormControl>
													<FormLabel className="font-normal">Linode</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="self-hosted" />
													</FormControl>
													<FormLabel className="font-normal">Self-Hosted</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="none" />
													</FormControl>
													<FormLabel className="font-normal">None</FormLabel>
												</FormItem>
											</RadioGroup>
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
