import { getRouteApi } from '@tanstack/react-router';
import { useGetClusterInfo } from '@/features/cluster/hooks/useGetClusterInfo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewInstanceModal from './modals/NewInstanceModal';
import { DataTable } from '@/components/DataTable';
import { ReactNode, useMemo } from 'react';
import { CellContext } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

const route = getRouteApi('');

function EmptyCluster() {
	return <p>No instances found.</p>;
}

const renderBadgeColor = (value: string) => {
	switch (value) {
		case 'PROVISIONING':
			return <Badge color="yellow">Provisioning</Badge>;
		case 'RUNNING':
			return <Badge color="green">Running</Badge>;
		case 'STOPPED':
			return <Badge color="red">Stopped</Badge>;
		case 'TERMINATED':
			return <Badge color="red">Terminated</Badge>;
		default:
			return <Badge>{cell.getValue()}</Badge>;
	}
};

function ClusterIndex() {
	const { clusterId } = route.useParams();
	const { data: cluster, isLoading } = useGetClusterInfo(clusterId);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name', // Accessor key for the "name" field from data object
				header: 'Name', // Column header
			},
			{
				accessorKey: 'clusterId',
				header: 'Cluster ID',
			},
			{
				accessorKey: 'instanceTypeId',
				header: 'Instance Type ID',
			},
			{
				accessorKey: 'status',
				header: 'Status',
				cell: (cell: CellContext<string, ReactNode>) => {
					return renderBadgeColor(cell.getValue());
				},
			},
			{
				accessorKey: 'version',
				header: 'Version',
			},
		],
		[]
	);
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
						<DataTable data={cluster.instances} columns={columns} />
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
