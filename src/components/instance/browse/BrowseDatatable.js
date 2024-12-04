import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useInterval from 'use-interval';
import { Card, CardBody } from 'reactstrap';
import { useStoreState } from 'pullstate';

import instanceState from '../../../functions/state/instanceState';

import config from '../../../config';
import DataTableHeader from './BrowseDatatableHeader';
import DataTable from '../../shared/DataTable';
import getTableData from '../../../functions/instance/getTableData';
import getTablePagination from '../../../functions/instance/getTablePagination';
import usePersistedUser from '../../../functions/state/persistedUser';
import { TableStateContext } from '../../../state/browse/TableContext';

let controller;
let controller2;
let controller3;

function BrowseDatatable({ tableState, setTableState, activeTable, tableDescriptionAttributes }) {
	const navigate = useNavigate();
	const { compute_stack_id, schema, table, customer_id } = useParams();
	const auth = useStoreState(instanceState, (s) => s.auth);
	const url = useStoreState(instanceState, (s) => s.url);
	const [totalPages, setTotalPages] = useState(false);
	const [totalRecords, setTotalRecords] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingFilter, setLoadingFilter] = useState(false);
	const [lastUpdate, setLastUpdate] = useState(true);
	const [persistedUser, setPersistedUser] = usePersistedUser({});
	const [tableContextState, setTableContextState] = useContext(TableStateContext);

	useEffect(() => {
		controller?.abort();
		controller2?.abort();
		controller3?.abort();
		setLoadingFilter(false);
		setLoading(false);

		let isMounted = true;

		const fetchPagination = async () => {
			setLoadingFilter(true);
			setTotalPages(false);
			controller3 = new AbortController();

			const { newTotalRecords, newTotalPages } = await getTablePagination({
				schema,
				table,
				filtered: tableState.filtered,
				pageSize: tableState.pageSize,
				auth,
				url,
				signal: controller3.signal,
			});
			if (isMounted) {
				setLoadingFilter(false);
				setTotalPages(newTotalPages);
				setTotalRecords(newTotalRecords);
			}
		};

		const fetchData = async () => {
			if (!tableState.filtered.length) {
				setLoading(true);
			}
			controller = new AbortController();
			controller2 = new AbortController();
			const {
				newData,
				newTotalRecords,
				newTotalPages,
				newEntityAttributes,
				hashAttribute,
				dynamicAttributesFromDataTable,
				dataTableColumns,
				error,
			} = await getTableData({
				schema,
				table,
				filtered: tableState.filtered,
				pageSize: parseInt(tableState.pageSize, 10),
				sorted: tableState.sorted,
				onlyCached: persistedUser?.onlyCached?.[activeTable],
				page: tableState.page,
				auth,
				url,
				signal: controller.signal,
				signal2: controller2.signal,
			});

			if (isMounted) {
				setLoading(false);
				if (newData.error) {
					setTableContextState({
						...tableContextState,
						tableData: [],
						newEntityAttributes,
						hashAttribute,
						dataTableColumns,
						error: newData.error,
					});
					setTableState({
						...tableState,
						tableData: [],
						error,
					});
				} else {
					if (!tableState.filtered.length) {
						setTotalPages(newTotalPages);
						setTotalRecords(newTotalRecords);
					} else if (newData.length < tableState.pageSize) {
						setTotalPages(1);
						setTotalRecords(newData.length);
					} else {
						fetchPagination();
					}
					setTableContextState({
						...tableContextState,
						tableData: newData,
						newEntityAttributes,
						hashAttribute,
						dataTableColumns,
						error,
					});
					setTableState({
						...tableState,
						tableData: newData,
						newEntityAttributes,
						hashAttribute,
						dataTableColumns,
						dynamicAttributesFromDataTable,
						error,
					});
				}
			}
		};

		fetchData();

		return () => {
			controller?.abort();
			controller2?.abort();
			controller3?.abort();
			isMounted = false;
		};
		// eslint-disable-next-line
	}, [
		tableState.sorted,
		tableState.page,
		tableState.filtered,
		tableState.pageSize,
		persistedUser.onlyCached,
		lastUpdate,
		activeTable,
	]);

	const toggleOnlyCached = () => {
		const onlyCached = typeof persistedUser.onlyCached === 'object' ? { ...persistedUser.onlyCached } : {};
		onlyCached[activeTable] = !persistedUser?.onlyCached?.[activeTable];
		setPersistedUser({ ...persistedUser, onlyCached });
	};

	useInterval(() => tableState.autoRefresh && setLastUpdate(Date.now()), config.refresh_content_interval);

	return (
		<>
			<DataTableHeader
				totalRecords={totalRecords}
				loading={loading}
				loadingFilter={loadingFilter}
				autoRefresh={tableState.autoRefresh}
				onlyCached={persistedUser?.onlyCached?.[activeTable]}
				refresh={() => setLastUpdate(Date.now())}
				toggleAutoRefresh={() => {
					setTableContextState({ ...tableContextState, autoRefresh: !tableContextState.autoRefresh });
					setTableState({ ...tableState, autoRefresh: !tableState.autoRefresh });
				}}
				toggleOnlyCached={toggleOnlyCached}
				toggleFilter={() => {
					setTableContextState({ ...tableContextState, showFilter: !tableContextState.showFilter });
					setTableState({ ...tableState, showFilter: !tableState.showFilter });
				}}
			/>
			<Card className="my-3">
				<CardBody className="react-table-holder">
					<DataTable
						manual
						columns={tableState.dataTableColumns || []}
						data={tableState.tableData || []}
						error={tableState.error}
						tableDescriptionAttributes={tableDescriptionAttributes}
						dynamicAttributesFromDataTable={tableState.dynamicAttributesFromDataTable}
						currentPage={tableState.page}
						pageSize={tableState.pageSize}
						totalPages={totalPages || 0}
						showFilter={tableState.showFilter}
						sorted={tableState.sorted.length ? tableState.sorted : [{ id: tableState.hashAttribute, desc: false }]}
						loading={loading && !tableState.autoRefresh}
						onFilteredChange={(value) => {
							setTableContextState({ ...tableContextState, page: 0, filtered: value });
							setTableState({ ...tableState, page: 0, filtered: value });
						}}
						onSortedChange={(value) => {
							setTableContextState({ ...tableContextState, page: 0, sorted: value });
							setTableState({ ...tableState, page: 0, sorted: value });
						}}
						onPageChange={(value) => {
							setTableContextState({ ...tableContextState, page: value });
							setTableState({ ...tableState, page: value });
						}}
						onPageSizeChange={(value) => {
							setTableContextState({ ...tableContextState, page: 0, pageSize: value });
							setTableState({ ...tableState, page: 0, pageSize: value });
						}}
						onRowClick={(rowData) => {
							// encode schema, table and hashValue because they can contain uri components
							const hashValue = rowData[tableState.hashAttribute];
							const encodedSchema = encodeURIComponent(schema);
							const encodedTable = encodeURIComponent(table);
							const encodedHash = encodeURIComponent(hashValue);

							const recordViewUrl = `/o/${customer_id}/i/${compute_stack_id}/browse/${encodedSchema}/${encodedTable}/edit/${encodedHash}`;
							const navigateOptions = { state: { hashValue } };

							navigate(recordViewUrl, navigateOptions);
						}}
					/>
				</CardBody>
			</Card>
		</>
	);
}

export default BrowseDatatable;
