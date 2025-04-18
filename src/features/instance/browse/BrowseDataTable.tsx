import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { getDescribeTableQueryOptions } from '@/features/instance/queries/operations/useDescribeTable';
import { getSearchByValueOptions } from '@/features/instance/queries/operations/useSearchByValue';
import { DataTable } from '@/components/DataTable';

type AttributesTypes = { attribute: string; is_primary_key: boolean; type: string; indexed: boolean; elements: string };

const route = getRouteApi('');

function BrowseDataTable() {
	const { instanceId, schemaName, tableName } = route.useParams();
	const { data: describeTableData } = useSuspenseQuery(
		getDescribeTableQueryOptions({
			instanceId,
			schemaName,
			tableName,
		})
	);

	const { hash_attribute, attributes } = describeTableData.data;
	// console.log('header data:', describeTableData);
	// Build out describe table data types migrate AttributeTypes to it
	const allAttributes = attributes.map((item: AttributesTypes) => item.attribute);
	console.log('all attributes:', allAttributes);

	const orderedColumns = allAttributes.filter(
		(attribute) => ![hash_attribute, '__createdtime__', '__updatedtime__'].includes(attribute)
	);

	if (allAttributes.includes('__createdtime__')) orderedColumns.push('__createdtime__');
	if (allAttributes.includes('__updatedtime__')) orderedColumns.push('__updatedtime__');

	const dataTableColumns = (hash_attribute ? [hash_attribute, ...orderedColumns] : [...orderedColumns]).map((k) => ({
		Header: k === 'id' ? 'Primary Key' : k.toString(),
		accessorKey: k.toString(),
	}));
	console.log('dataTableColumns:', dataTableColumns);

	const { data: tableData } = useSuspenseQuery(
		getSearchByValueOptions({
			instanceId,
			schemaName,
			tableName,
			hash_attribute,
		})
	);

	// console.log('table data', tableData);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Data</h2>
				<button className="btn btn-primary">Add Data</button>
			</div>
			<DataTable data={tableData} columns={dataTableColumns} />
			{/* <DataTable data={cluster.instances as unknown as string[]} columns={data.data.attributes} /> */}
		</div>
	);
}

export default BrowseDataTable;
