import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OrgCard from '@/features/organizations/components/OrgCard';
import { useGetCurrentUser } from '@/hooks/useGetCurrentUser';
import NewOrganizationModal from '@/features/organizations/modals/NewOrganizationModal';
function OrganizationsIndex() {
	const { data: user } = useGetCurrentUser();
	return (
		<div>
			<div className="flex flex-col-reverse justify-between gap-4 mb-10 md:gap-0 md:flex-row">
				<div>
					<Input placeholder="Filter organizations by name" className="inline-block w-3/5 md:w-64" />
					<Button className="inline-block w-2/5 md:w-auto md:ml-4">
						Sort by A-Z
						<span>
							<ChevronDown className="inline-block" />
						</span>
					</Button>
				</div>
				<NewOrganizationModal />
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-12">
				{user?.roles.map(({ organizationId, organizationName, roleName }) => (
					<div key={organizationId} className="cols-span-1 md:col-span-4 lg:col-span-3 2xl:col-span-2">
						<OrgCard organizationId={organizationId} organizationName={organizationName} roleName={roleName} />
					</div>
				))}
			</div>
		</div>
	);
}

export default OrganizationsIndex;
