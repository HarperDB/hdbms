import { getRouteApi } from '@tanstack/react-router';
import ClusterCard from '@/features/organization/components/ClusterCard';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetOrganization } from '@/features/organization/hooks/useGetOrganization';
import NewClusterModal from '@/features/clusters/modals/NewClusterModal';

const route = getRouteApi('');

function ClustersList() {
	const { organizationId } = route.useParams();
	const { data: orgInfo, isLoading, isError, isSuccess } = useGetOrganization(organizationId);

	return (
		<div>
			<section>
				<div className="flex flex-col-reverse justify-between gap-4 mb-10 md:gap-0 md:flex-row">
					<div>
						<Input placeholder="Filter clusters by name" className="inline-block w-3/5 md:w-64" />
						<Button className="inline-block w-2/5 md:w-auto md:ml-4">
							Sort by A-Z
							<span>
								<ChevronDown className="inline-block" />
							</span>
						</Button>
					</div>
					<NewClusterModal orgId={organizationId} />
				</div>
			</section>
			<section>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-12">
					{isSuccess &&
						orgInfo?.clusters.map((cluster) => (
							<div key={cluster.id} className="cols-span-1 md:col-span-4 lg:col-span-3 2xl:col-span-2">
								<ClusterCard
									clusterName={cluster.name}
									clusterId={cluster.id}
									organizationId={cluster.organizationId}
								/>
							</div>
						))}
				</div>
			</section>
		</div>
	);
}

export default ClustersList;
