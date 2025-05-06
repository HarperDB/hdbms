import Loading from '@/components/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { renderBadgeLogLevelText, renderBadgeLogLevelVariant } from '@/components/ui/utils/badgeLogLevel';
import Editor from '@monaco-editor/react';
import { Save, Trash } from 'lucide-react';

function isJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

function ViewLogModal({
	setIsModalOpen,
	isModalOpen,
	data,
}: {
	setIsModalOpen: (open: boolean) => void;
	isModalOpen: boolean;
	data: {
		level: string;
		timestamp: string;
		thread: string;
		tags: string[];
		message: string;
	};
}) {
	return (
		<Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
			{/* NOTE - Is this okay to do for the aria describedby? */}
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Edit Row</DialogTitle>
				</DialogHeader>
				{data ? (
					// <Editor className="h-96 w-full" language="json" theme="vs-dark" value={JSON.stringify(data, null, 4)} />
					<div className="text-white">
						<h3>
							Level:{' '}
							<Badge variant={renderBadgeLogLevelVariant(data.level)}>{renderBadgeLogLevelText(data.level)}</Badge>
						</h3>

						<h3>Timestamp:</h3>
						<p className="">{data.timestamp}</p>
						<h3>
							Thread: <span>{data.thread}</span>
						</h3>
						<h3>
							Tags: <span>{data.tags}</span>
						</h3>
						<h3 className="text-lg font-bold">Message</h3>
						<Editor
							className="h-72 w-full"
							language={isJsonString(data.message) ? 'json' : 'text'}
							theme="vs-dark"
							value={data.message}
							options={{
								readOnly: true,
								minimap: {
									enabled: false,
								},
								scrollBeyondLastLine: false,
							}}
						/>
					</div>
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

export default ViewLogModal;
