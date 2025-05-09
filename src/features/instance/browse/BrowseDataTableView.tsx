import { useEffect, useState } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { getDescribeTableQueryOptions } from '@/features/instance/queries/operations/useDescribeTable';
import { getSearchByValueOptions } from '@/features/instance/queries/operations/useSearchByValue';
import BrowseDataTable from '@/features/instance/browse/components/BrowseDataTable';
import EditTableRowModal from '@/features/instance/modals/EditTableRowModal';
import { getSearchByHashOptions } from '@/features/instance/queries/operations/useSearchByHash';
import { formatBrowseDataTableHeader } from '@/features/instance/browse/functions/formatBrowseDataTableHeader';
import { PaginationState } from '@tanstack/react-table';
import { useUpdateTableRecords } from '@/features/instance/operations/mutations/updateTableRecords';
import { toast } from 'sonner';

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
	const [totalRecords, setTotalRecords] = useState(describeTableData.data.record_count);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 20,
	});
	const [totalPages, setTotalPages] = useState(Math.ceil(describeTableData.data.record_count / pagination.pageSize));

	const { data: tableData, refetch: refetchSearchByValueOptions } = useSuspenseQuery(
		getSearchByValueOptions({
			instanceId,
			schemaName,
			tableName,
			hash_attribute,
			sortTableDataParams,
			pagination,
		})
	);
	const { mutate: updateTableRecords, isPending: isUpdateTableRecordsPending } = useUpdateTableRecords();

	const onRecordUpdate = async (data: object[]) => {
		console.log('onRecordUpdate', data);
		updateTableRecords(
			{
				databaseName: schemaName,
				tableName,
				records: data,
			},
			{
				onSuccess: () => {
					refetchSearchByValueOptions();
					setIsEditModalOpen(false);
					toast.success('Record updated successfully');
				},
			}
		);
		// await refetchDescribeTableQueryOptions();
		// await refetchSearchByHash();
	};

	// TODO: fix this. It reloads the table several times unnecessarily
	useEffect(() => {
		refetchDescribeTableQueryOptions();
		refetchSearchByValueOptions();
		setTotalRecords(describeTableData.data.record_count);
		setTotalPages(Math.ceil(describeTableData.data.record_count / pagination.pageSize));
	}, [
		refetchDescribeTableQueryOptions,
		refetchSearchByValueOptions,
		instanceId,
		schemaName,
		tableName,
		pagination.pageSize,
		describeTableData.data.record_count,
		pagination,
	]);

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
				totalPages={totalPages}
				totalRecords={totalRecords}
				paginationState={pagination}
				setPagination={setPagination}
			/>
			<EditTableRowModal
				setIsModalOpen={setIsEditModalOpen}
				isModalOpen={isEditModalOpen}
				data={searchByHashData?.data}
				onSaveChanges={onRecordUpdate}
				isPending={isUpdateTableRecordsPending}
			/>
		</>
	);
}

export default BrowseDataTableView;
