import { getRouteApi, Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getClusterInfoQueryOptions } from '@/features/cluster/queries/getClusterInfoQuery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewInstanceModal from './modals/NewInstanceModal';
import { DataTable } from '@/components/DataTable';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import EditInstanceModal from './modals/EditInstanceModal';
import { BadgeStatus, renderBadgeStatusText, renderBadgeStatusVariant } from '@/components/ui/utils/badgeStatus';
// import { useRegistrationInfo } from '@/hooks/instance/useRegistrationInfo';
import InstanceLogInModal from './modals/InstanceLoginInModal';

// 1. Once successfully logging into one instance, we should be able to use the same credentials(cookie) for all instances in the cluster.
// Essentially looping through and do a query to logging into all the other instances.

// 2. Depending upon the status, we should call that instance's API to get the latest status and update the UI accordingly.

// 3. Navigate to the instance once the user clicks on the instance URL. If the instance is in a "PROVISIONING" state, we should show a loading spinner and disable the button until the instance is ready.

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
	const { organizationId, clusterId } = route.useParams();
	const { data: cluster, isLoading } = useSuspenseQuery(getClusterInfoQueryOptions(clusterId));
	// const { mutate: submitRegistrationData, data: registrationInfo } = useRegistrationInfo();

	const columns: ColumnDef<ColumnTypes, unknown>[] = useMemo(
		() => [
			{
				accessorKey: 'name', // Accessor key for the "name" field from data object
				header: 'Name', // Column header
			},
			{
				accessorKey: 'fqdns',
				header: 'Instance Url',
				cell: (cell) => {
					const dnsURLs: string[] = cell.getValue() as string[];
					if (!['CLONE_READY', 'RUNNING', 'UPDATED'].includes(cell.row.original.status)) {
						return <p>N/A</p>;
					}
					const instanceURL = dnsURLs[0];
					return (
						<>
							<InstanceLogInModal
								instanceId={cell.row.original.id}
								instanceUrl={instanceURL}
								instanceName={cell.row.original.name}
							/>
							<Link
								to={`/orgs/${organizationId}/clusters/${clusterId}/instance/${cell.row.original.id}`}
								className="text-sm"
								aria-label={`Go to ${cell.row.original.name} instance`}
								title={`Go to ${cell.row.original.name} instance`}
								target="_blank"
							>
								<span className="hover:border-b-2 py-2">
									{instanceURL}
									{/* <ArrowRight className="inline-block" /> */}
								</span>
							</Link>
						</>
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
				cell: (cell) => {
					const status = cell.getValue() as BadgeStatus;
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
				cell: (cell) => {
					if (!['CLONE_READY', 'RUNNING', 'UPDATED'].includes(cell.row.original.status)) {
						return null;
					}
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
