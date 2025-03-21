import { getRouteApi } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getClusterInfoQueryOptions } from '@/features/cluster/queries/getClusterInfoQuery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewInstanceModal from './modals/NewInstanceModal';
import { DataTable } from '@/components/DataTable';
import { useMemo } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import EditInstanceModal from './modals/EditInstanceModal';
import { renderBadgeStatusText, renderBadgeStatusVariant } from '@/components/ui/utils/badgeStatus';
// import { useRegistrationInfo } from '@/hooks/instance/useRegistrationInfo';
import InstanceLogInModal from './modals/InstanceLoginInModal';

const route = getRouteApi('');

type ColumnTypes = {
	id: string;
	name: string;
	fqdns: string[];
	instanceTypeId: string;
	status: string;
	version: string;
	storage: string;
	cpu: string;
	memory: string;
};

function EmptyCluster() {
	return <p>No instances found.</p>;
}

function ClusterIndex() {
	const { clusterId } = route.useParams();
	const { data: cluster, isLoading } = useSuspenseQuery(getClusterInfoQueryOptions(clusterId));
	// const { mutate: submitRegistrationData } = useRegistrationInfo();

	const columns: ColumnDef<ColumnTypes, string>[] = useMemo(
		() => [
			{
				accessorKey: 'name', // Accessor key for the "name" field from data object
				header: 'Name', // Column header
			},
			{
				accessorKey: 'fqdns',
				header: 'Instance Url',
				cell: (cell: CellContext<ColumnTypes, string>) => {
					const dnsURLs: string[] = cell.getValue() as unknown as string[];
					if (localStorage.getItem(`${cell.row.original?.id}`)) {
						return (
							<a href={`${dnsURLs[0]}`} target="_blank" rel="noreferrer" key={dnsURLs[0]} className="block">
								{dnsURLs[0]}
							</a>
						);
					}

					return (
						<InstanceLogInModal
							instanceId={cell.row.original.id}
							instanceUrl={dnsURLs[0]}
							instanceName={cell.row.original.name}
						/>
					);
				},
			},
			{
				accessorKey: 'instanceTypeId',
				header: 'Instance Type ID',
			},
			{
				accessorKey: 'status',
				header: 'Status',
				cell: (cell: CellContext<ColumnTypes, string>) => {
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
				cell: (cell: CellContext<ColumnTypes, string>) => {
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
						<DataTable data={cluster.instances as unknown as ColumnTypes[]} columns={columns} />
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
