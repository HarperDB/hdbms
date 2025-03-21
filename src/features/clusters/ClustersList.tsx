import { getRouteApi } from '@tanstack/react-router';
import ClusterCard from '@/features/organization/components/ClusterCard';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getOrganizationQueryOptions } from '@/features/organization/queries/getOrganizationQuery';
import NewClusterModal from '@/features/clusters/modals/NewClusterModal';
import { useSuspenseQuery } from '@tanstack/react-query';

const route = getRouteApi('');

function ClustersList() {
	const { organizationId } = route.useParams();
	const { data: orgInfo, isSuccess } = useSuspenseQuery(getOrganizationQueryOptions(organizationId));

	return (
		<div>
			<section>
				{isSuccess && orgInfo?.clusters?.length ? (
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
				) : null}
			</section>
			<section>
				<>
					{isSuccess && orgInfo?.clusters?.length ? (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-12">
							{orgInfo?.clusters.map((cluster) => (
								<div key={cluster.id} className="cols-span-1 md:col-span-4 lg:col-span-3 2xl:col-span-2">
									<ClusterCard
										clusterName={cluster.name}
										clusterId={cluster.id}
										organizationId={cluster.organizationId}
										status={cluster.status}
									/>
								</div>
							))}
						</div>
					) : (
						<div className="flex-col space-y-5 items-center justify-center text-center">
							<h2 className="text-2xl text-center text-white">No clusters found. Create a new cluster.</h2>
							<NewClusterModal orgId={organizationId} />
						</div>
					)}
				</>
			</section>
		</div>
	);
}

export default ClustersList;
