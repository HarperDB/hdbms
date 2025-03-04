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
import { NewClusterInfo, useCreateNewClusterMutation } from '../hooks/useCreateNewCluster';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const NewClusterSchema = z.object({
	clusterName: z.string({
		message: 'Please enter a cluster name.',
	}),
	clusterPrefix: z.string({
		message: 'Please enter a cluster prefix.',
	}),
});

function NewClusterModal({ orgId }: { orgId: string }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const form = useForm({
		resolver: zodResolver(NewClusterSchema),
		defaultValues: {
			clusterName: '',
			clusterPrefix: '',
		},
	});

	const { mutate: submitNewClusterData } = useCreateNewClusterMutation();
	const queryClient = useQueryClient();

	const submitForm = async (formData: { clusterName: string; clusterPrefix: string }) => {
		Object.assign(formData, { organizationId: orgId });
		const updatedFormData = {
			organizationId: orgId,
			...formData,
		} as NewClusterInfo;
		submitNewClusterData(updatedFormData, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['organization'], refetchType: 'active' });
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
							name="clusterName"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="pb-1">Cluster Name</FormLabel>
									<FormControl>
										<Input type="text" placeholder="ex. rad-cluster" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="clusterPrefix"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel className="pb-1">Cluster Prefix</FormLabel>
									<FormControl>
										<Input type="text" placeholder="ex. rad-c1" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
