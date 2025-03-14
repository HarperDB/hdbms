import { getRouteApi } from '@tanstack/react-router';
import { useGetClusterInfo } from '@/features/cluster/hooks/useGetClusterInfo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewInstanceModal from './modals/NewInstanceModal';
import { DataTable } from '@/components/DataTable';
import { useMemo } from 'react';
import { CellContext } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import EditInstanceModal from './modals/EditInstanceModal';
import { renderBadgeStatusText, renderBadgeStatusVariant } from '@/components/ui/utils/badgeStatus';

const route = getRouteApi('');

function EmptyCluster() {
	return <p>No instances found.</p>;
}

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
				accessorKey: 'fqdns',
				header: 'FQDNs',
				cell: (cell: CellContext<string, string>) => {
					const dnsURLs: string[] = cell.getValue() as unknown as string[];
					return dnsURLs.map((fqdn: string) => (
						<a href={`https://${fqdn}`} target="_blank" rel="noreferrer" key={fqdn} className="block">
							{fqdn}
						</a>
					));
				},
			},
			{
				accessorKey: 'instanceTypeId',
				header: 'Instance Type ID',
			},
			{
				accessorKey: 'status',
				header: 'Status',
				cell: (cell: CellContext<string, string>) => {
					const status = cell.getValue();
					return <Badge variant={renderBadgeStatusVariant(status)}>{renderBadgeStatusText(status)}</Badge>;
				},
			},
			{
				accessorKey: 'version',
				header: 'Version',
			},
			{
				accessorKey: 'storage',
				header: 'Storage',
			},
			{
				accessorKey: 'cpu',
				header: 'CPU',
			},
			{
				accessorKey: 'memory',
				header: 'Memory',
			},
			{
				id: 'actions',
				header: () => '',
				cell: (cell: CellContext<string, string>) => {
					//@ts-expect-error we're getting the id and name from the instance object from the row.
					return <EditInstanceModal instanceId={cell.row.original.id} instanceName={cell.row.original.name} />;
				},
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
						<DataTable data={cluster.instances as unknown as string[]} columns={columns} />
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
