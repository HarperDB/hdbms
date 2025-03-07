import { getRouteApi } from '@tanstack/react-router';
import { useGetClusterInfo } from '@/features/cluster/hooks/useGetClusterInfo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewInstanceModal from './modals/NewInstanceModal';

const route = getRouteApi('');

function EmptyCluster() {
	return <p>No instances found.</p>;
}

function ClusterIndex() {
	const { clusterId } = route.useParams();
	const { data: cluster, isLoading } = useGetClusterInfo(clusterId);
	return (
		<div className="mx-auto max-w-7xl">
			<Card className="min-h-96">
				<CardHeader className="flex justify-between">
					<div>
						<CardTitle className="flex items-center justify-between">
							{cluster?.name} <NewInstanceModal clusterId={clusterId} />{' '}
						</CardTitle>
						<CardDescription>Cluster ID: {clusterId}</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="min-h-96">
					{isLoading ? (
						<div>Loading...</div> // TODO: Add skeleton component
					) : cluster?.instances.length ? (
						<ul>
							{cluster?.instances.map((instance) => (
								<li key={instance.id}>{instance.name}</li>
							))}
						</ul>
					) : (
						<div className="text-center">
							<EmptyCluster />
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default ClusterIndex;
