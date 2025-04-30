import { useEffect, useState } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { getDescribeTableQueryOptions } from '@/features/instance/queries/operations/useDescribeTable';
import { getSearchByValueOptions } from '@/features/instance/queries/operations/useSearchByValue';
import BrowseDataTable from '@/features/instance/browse/components/BrowseDataTable';
import EditTableRowModal from '@/features/instance/modals/EditTableRowModal';
import { ColumnDef, Row, RowData } from '@tanstack/react-table';
import { getSearchByHashOptions } from '@/features/instance/queries/operations/useSearchByHash';
import { Button } from '@/components/ui/button';

type AttributesTypes = {
	attribute: string;
	is_primary_key: boolean;
	type: string;
	indexed: boolean;
	elements: string;
};

// type DataTableState = {
// 	dataTableColumns: ColumnDef<string[]>[];
// 	tableData: string[][];
// 	dynamicAttributesFromDataTable: string[];
// 	hashAttribute: string;
// 	page: number;
// 	pageSize: number;
// 	schemaAttributes: AttributesTypes[];
// };

const route = getRouteApi('');

function BrowseDataTableView() {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [sortTableDataParams, setSortTableDataParams] = useState({
		attribute: '',
		descending: false,
	});
	const { instanceId, schemaName, tableName } = route.useParams();
	const { data: describeTableData, refetch: refetchDescribeTableQueryOptions } = useSuspenseQuery(
		getDescribeTableQueryOptions({
			instanceId,
			schemaName,
			tableName,
		})
	);
	const [searchByHashParams, setSearchByHashParams] = useState({
		instanceId,
		schemaName,
		tableName,
		hashAttribute: [''],
	});

	const { data: searchByHashData, refetch: refetchSearchByHash } = useQuery(getSearchByHashOptions(searchByHashParams));

	const { hash_attribute, attributes } = describeTableData.data;
	// console.log('header data:', describeTableData);
	// Build out describe table data types migrate AttributeTypes to it
	const allAttributes = attributes.map((item: AttributesTypes) => item.attribute);

	const orderedColumns = allAttributes.filter(
		(attribute) => ![hash_attribute, '__createdtime__', '__updatedtime__'].includes(attribute)
	);

	if (allAttributes.includes('__createdtime__')) orderedColumns.push('__createdtime__');
	if (allAttributes.includes('__updatedtime__')) orderedColumns.push('__updatedtime__');

	const dataTableColumns: ColumnDef<string[]>[] = (
		hash_attribute ? [hash_attribute, ...orderedColumns] : [...orderedColumns]
	).map((columnKey) => ({
		header: columnKey === 'id' ? 'Primary Key' : columnKey.toString(),
		accessorKey: columnKey.toString(),
	}));

	// const dataTableColumns: ColumnDef<string[]>[] = (
	// 	hash_attribute ? [hash_attribute, ...orderedColumns] : [...orderedColumns]
	// ).map((columnKey) => ({
	// 	header: ({ column }) => {
	// 		return (
	// 			<Button
	// 				onClick={() => {
	// 					onHeaderColumnClick(column.id);
	// 				}}
	// 			>
	// 				{column.id === 'id' ? 'Primary Key' : column.id.toString()}
	// 			</Button>
	// 		);
	// 	},
	// 	accessorKey: columnKey.toString(),
	// }));

	const { data: tableData, refetch: refetchSearchByValueOptions } = useSuspenseQuery(
		getSearchByValueOptions({
			instanceId,
			schemaName,
			tableName,
			hash_attribute,
			sortTableDataParams,
		})
	);

	// TODO: fix this. It reloads the table several times unnecessarily
	useEffect(() => {
		refetchDescribeTableQueryOptions();
		refetchSearchByValueOptions();
	}, [refetchDescribeTableQueryOptions, refetchSearchByValueOptions, instanceId, schemaName, tableName]);

	const onRowClick = async (rowData: Row<RowData>) => {
		await setSearchByHashParams({
			instanceId,
			schemaName,
			tableName,
			hashAttribute: rowData.original[`${hash_attribute}`],
		});
		refetchSearchByHash();
		setIsEditModalOpen(!isEditModalOpen);
	};

	// const onHeaderColumnClick = async (columnData: Row<RowData>) => {
	// 	await setSortTableDataParams({
	// 		attribute: columnData.id,
	// 		descending: false,
	// 	});
	// 	refetchSearchByValueOptions();
	// };

	return (
		<>
			<BrowseDataTable data={tableData.data} columns={dataTableColumns} onRowClick={onRowClick} />
			<EditTableRowModal
				setIsModalOpen={setIsEditModalOpen}
				isModalOpen={isEditModalOpen}
				data={searchByHashData?.data}
			/>
		</>
	);
}

export default BrowseDataTableView;
