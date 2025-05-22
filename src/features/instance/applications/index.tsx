import { Button } from '@/components/ui/button';
import { Import, Plus } from 'lucide-react';

function Applications() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-12">
			<section className='className="col-span-1 text-white md:col-span-4 lg:col-span-3'>
				<div>
					<p>You have no Harper applications yet.</p>
					<p>See the documentation for more info on Harper Applications.</p>
					<p>Click "+ app" above to create one!</p>
				</div>
			</section>
			<section className="col-span-1 text-white md:col-span-8 lg:col-span-9">
				<div>
					<h1 className="text-2xl font-bold">Applications</h1>
					<p className="mt-2 text-gray-500">No applications found.</p>
					<Button className="mt-4" variant="positiveOutline">
						<Plus /> Create A New Application Using The Default Template
					</Button>
					<Button className="mt-4" variant="positiveOutline">
						<Import /> Import Or Deploy A Remote Application Package
					</Button>
				</div>
			</section>
		</div>
	);
}

export default Applications;
