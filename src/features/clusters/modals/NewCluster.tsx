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
import { ArrowRight, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

function NewClusterModal() {
	const form = useForm({
		// resolver: zodResolver(SignInSchema),
		defaultValues: {
			clusterName: '',
			clusterPrefix: '',
		},
	});

	const submitForm = async (formData: unknown) => {
		console.log(formData);
	};

	return (
		<Dialog>
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
