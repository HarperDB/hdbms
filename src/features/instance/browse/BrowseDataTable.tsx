import { useSuspenseQuery } from '@tanstack/react-query';
import { getDescribeTableQueryOptions } from '@/features/instance/queries/operations/useDescribeTable';

const route = getRouteApi('');

function BrowseDataTable() {
	const { organizationId, clusterId, instanceId, schemaName, tableName } = route.useParams();
	const { data } = useSuspenseQuery(
		getDescribeTableQueryOptions({
			instanceUrl,
			schemaName,
			tableName,
		})
	);
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Data</h2>
				<button className="btn btn-primary">Add Data</button>
			</div>
			<table className="table table-zebra">
				<thead>
					<tr>
						<th>Data ID</th>
						<th>Type</th>
						<th>Size</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{/* Example data row */}
					<tr>
						<td>1</td>
						<td>Image</td>
						<td>2 MB</td>
						<td>
							<button className="btn btn-secondary">View</button>
							<button className="btn btn-danger">Delete</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default BrowseDataTable;
