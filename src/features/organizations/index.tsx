import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OrgCard from '@/features/organizations/components/OrgCard';
import { useGetCurrentUser } from '@/hooks/useGetCurrentUser';
function OrganizationsIndex() {
	const { data: user } = useGetCurrentUser();
	return (
		<div>
			<div className="flex flex-col-reverse md:flex-row justify-between mb-10">
				<div className="">
					<Input placeholder="Filter organizations by name" className="w-full md:w-64 inline-block" />
					<Button className="inline-block w-full md:w-auto md:ml-4">
						Sort by A-Z
						<span>
							<ChevronDown className="inline-block" />
						</span>
					</Button>
				</div>
				<Button variant="positive" className="rounded-full md:w-44">
					<Plus />
					New Organization
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
				{user?.roles?.map(({ organizationId, organizationName, roleName }) => (
					<div key={organizationId} className="cols-span-1 md:col-span-4 lg:col-span-3 2xl:col-span-2">
						<OrgCard organizationId={organizationId} organizationName={organizationName} roleName={roleName} />
					</div>
				))}
			</div>
		</div>
	);
}

export default OrganizationsIndex;
