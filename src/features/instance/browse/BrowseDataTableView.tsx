import { useEffect, useState } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { getDescribeTableQueryOptions } from '@/features/instance/queries/operations/useDescribeTable';
import { getSearchByValueOptions } from '@/features/instance/queries/operations/useSearchByValue';
import BrowseDataTable from '@/features/instance/browse/components/BrowseDataTable';
import EditTableRowModal from '@/features/instance/modals/EditTableRowModal';
import { getSearchByHashOptions } from '@/features/instance/queries/operations/useSearchByHash';
import { formatBrowseDataTableHeader } from '@/features/instance/browse/functions/formatBrowseDataTableHeader';

// TODO: Define on describe table data call
// type AttributesTypes = {
// 	attribute: string;
// 	is_primary_key: boolean;
// 	type: string;
// 	indexed: boolean;
// 	elements: string;
// };

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

	const { dataTableColumns, hash_attribute } = formatBrowseDataTableHeader(describeTableData.data);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [sortTableDataParams, setSortTableDataParams] = useState({
		attribute: '',
		descending: false,
	});
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

	const onRowClick = async (rowData) => {
		await setSearchByHashParams({
			instanceId,
			schemaName,
			tableName,
			hashAttribute: rowData.original[`${hash_attribute}`],
		});
		refetchSearchByHash();
		setIsEditModalOpen(!isEditModalOpen);
	};

	const onColumnClick = async (accessorKey: string, isDescending: boolean) => {
		await setSortTableDataParams({
			attribute: accessorKey,
			descending: isDescending,
		});
		refetchSearchByValueOptions();
	};

	return (
		<>
			<BrowseDataTable
				data={tableData.data}
				columns={dataTableColumns}
				onRowClick={onRowClick}
				onColumnClick={onColumnClick}
			/>
			<EditTableRowModal
				setIsModalOpen={setIsEditModalOpen}
				isModalOpen={isEditModalOpen}
				data={searchByHashData?.data}
			/>
		</>
	);
}

export default BrowseDataTableView;
