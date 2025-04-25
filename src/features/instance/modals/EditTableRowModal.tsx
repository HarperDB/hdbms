import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import Editor from '@monaco-editor/react';
import { Save, Trash } from 'lucide-react';

function EditTableRowModal({
	setIsModalOpen,
	isModalOpen,
	data,
}: {
	setIsModalOpen: (open: boolean) => void;
	isModalOpen: boolean;
	data: object[];
}) {
	return (
		<Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Row</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<Editor className="h-96 w-full" language="json" theme="vs-dark" value={JSON.stringify(data, null, 4)} />
				</DialogDescription>
				<DialogFooter>
					<div className="flex justify-between w-full">
						<Button variant="destructive" className="rounded-full">
							<Trash /> Delete Row
						</Button>
						<Button variant="submit" className="rounded-full">
							<Save /> Save Changes
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default EditTableRowModal;
