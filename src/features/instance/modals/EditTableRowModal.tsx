import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
			{/* NOTE - Is this okay to do for the aria describedby? */}
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Edit Row</DialogTitle>
				</DialogHeader>
				{data ? (
					<Editor className="h-96 w-full" language="json" theme="vs-dark" value={JSON.stringify(data, null, 4)} />
				) : (
					<Loading />
				)}
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
