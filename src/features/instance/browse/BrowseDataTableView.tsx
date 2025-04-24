import { useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { getDescribeTableQueryOptions } from '@/features/instance/queries/operations/useDescribeTable';
import { getSearchByValueOptions } from '@/features/instance/queries/operations/useSearchByValue';
import BrowseDataTable from '@/features/instance/browse/components/BrowseDataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type AttributesTypes = { attribute: string; is_primary_key: boolean; type: string; indexed: boolean; elements: string };

const route = getRouteApi('');

function BrowseDataTableView() {
	const { instanceId, schemaName, tableName } = route.useParams();
	const { data: describeTableData, refetch: refetchDescribeTableQueryOptions } = useSuspenseQuery(
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

	const orderedColumns = allAttributes.filter(
		(attribute) => ![hash_attribute, '__createdtime__', '__updatedtime__'].includes(attribute)
	);

	if (allAttributes.includes('__createdtime__')) orderedColumns.push('__createdtime__');
	if (allAttributes.includes('__updatedtime__')) orderedColumns.push('__updatedtime__');

	const dataTableColumns = (hash_attribute ? [hash_attribute, ...orderedColumns] : [...orderedColumns]).map((k) => ({
		Header: k === 'id' ? 'Primary Key' : k.toString(),
		accessorKey: k.toString(),
	}));

	const { data: tableData, refetch: refetchSearchByValueOptions } = useSuspenseQuery(
		getSearchByValueOptions({
			instanceId,
			schemaName,
			tableName,
			hash_attribute,
		})
	);

	// TODO: fix this. It reloads the table several times unnecessarily
	useEffect(() => {
		refetchDescribeTableQueryOptions();
		refetchSearchByValueOptions();
	}, [instanceId, schemaName, tableName, refetchDescribeTableQueryOptions, refetchSearchByValueOptions]);
	return (
		<>
			<BrowseDataTable data={tableData.data} columns={dataTableColumns} />
		</>
	);
}

export default BrowseDataTableView;
