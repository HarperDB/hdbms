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
import { ArrowLeft, ArrowRight, Edit, Trash, TriangleAlert } from 'lucide-react';
import { set, useForm } from 'react-hook-form';
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
import { useDeleteInstance } from '../hooks/useDeleteInstance';
import { toast } from 'sonner';

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

function DeleteInstanceContent({
	setIsDeleteContentDisplayed,
	instanceId,
	instanceName,
}: {
	setIsDeleteContentDisplayed: (value: boolean) => void;
	instanceId: string;
	instanceName: string;
}) {
	const { mutate: deleteInstance, isPending } = useDeleteInstance();

	const handleDeleteInstance = () => {
		deleteInstance(instanceId, {
			onSuccess: () => {
				setIsDeleteContentDisplayed(false);
				toast.success('Success', {
					description: `Instance: ${instanceName} successfully deleted.`,
					action: {
						label: 'Dismiss',
						onClick: () => toast.dismiss(),
					},
				});
			},
			onError: () => {
				toast.error('Error', {
					description: `Failed to delete instance: ${instanceName}.`,
					action: {
						label: 'Dismiss',
						onClick: () => toast.dismiss(),
					},
				});
				setIsDeleteContentDisplayed(false);
			},
		});
	};

	return (
		<div>
			<DialogHeader>
				<DialogTitle>Delete Instance</DialogTitle>
				<DialogDescription>Are you sure you want to delete this instance?</DialogDescription>
			</DialogHeader>
			<div className="p-3 bg-amber-600 rounded-md my-5 text-white">
				<p className="font-semibold flex align-baseline space-x-1">
					<TriangleAlert className="inline-block size-5" /> <span>Warning</span>
				</p>
				<p className="pt-2 text-base">By deleting this instance you will lose the data stored in it permanently.</p>
			</div>
			<DialogFooter>
				<div className="flex justify-center space-x-5">
					<Button className="rounded-full" onClick={() => setIsDeleteContentDisplayed(false)}>
						<ArrowLeft /> Cancel
					</Button>
					<Button variant="destructive" className="rounded-full" disabled={isPending} onClick={handleDeleteInstance}>
						<Trash /> Delete
					</Button>
				</div>
			</DialogFooter>
		</div>
	);
}

function UpdateInstanceContent({
	setIsDeleteContentDisplayed,
}: {
	setIsDeleteContentDisplayed: (value: boolean) => void;
}) {
	return (
		<div>
			<DialogHeader>
				<DialogTitle>Edit Instance</DialogTitle>
				<DialogDescription>Update instance details here.</DialogDescription>
			</DialogHeader>
			<form className="grid gap-6 text-white">
				<p>Figure out what can be edited for the instance</p>
				<DialogFooter>
					<div className="flex space-x-5">
						<Button
							type="button"
							variant="destructive"
							className="rounded-full"
							onClick={() => setIsDeleteContentDisplayed(true)}
						>
							<Trash /> Delete
						</Button>
						<Button type="submit" variant="submit" className="rounded-full">
							Update <ArrowRight />
						</Button>
					</div>
				</DialogFooter>
			</form>
		</div>
	);
}

function EditInstanceModal({ instanceId, instanceName }: { instanceId: string; instanceName: string }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteContentDisplayed, setIsDeleteContentDisplayed] = useState(false);

	return (
		<Dialog
			open={isModalOpen}
			onOpenChange={() => {
				setIsModalOpen(!isModalOpen);
				// Funky way to prevent the update instance form transition to happen when the modal is closed
				setTimeout(() => {
					setIsDeleteContentDisplayed(false);
				}, 1000);
			}}
		>
			<DialogTrigger asChild>
				<Button className="rounded-md" aria-label={`Edit Instance ${instanceName}`}>
					<Edit />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				{isDeleteContentDisplayed ? (
					<DeleteInstanceContent
						setIsDeleteContentDisplayed={setIsDeleteContentDisplayed}
						instanceId={instanceId}
						instanceName={instanceName}
					/>
				) : (
					<UpdateInstanceContent setIsDeleteContentDisplayed={setIsDeleteContentDisplayed} />
				)}
			</DialogContent>
		</Dialog>
	);
}

export default EditInstanceModal;
