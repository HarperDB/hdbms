import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';
import { Card, CardBody } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import config from '../../../config';
import instanceState from '../../../functions/state/instanceState';

import DataTableHeader from './datatableHeader';
import ChartModal from './chartModal';
import getQueryData from '../../../functions/instance/getQueryData';
import EmptyPrompt from './emptyPrompt';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../functions/api/lms/addError';
import DataTable from '../../shared/dataTable';

const defaultTableState = {
  tableData: false,
  totalRecords: 0,
  dataTableColumns: [],
  filtered: [],
  sorted: [],
  page: 0,
  loading: false,
  totalPages: 1,
  pageSize: 20,
  autoRefresh: false,
  showFilter: false,
  lastUpdate: false,
};

let controller;

const Datatable = ({ query }) => {
  const { customer_id, compute_stack_id } = useParams();
  const [lastUpdate, setLastUpdate] = useState();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const [tableState, setTableState] = useState(defaultTableState);
  const [showChartModal, setShowChartModal] = useState(false);

  useAsyncEffect(() => {
    if (query.query) {
      setTableState({ ...defaultTableState, reload: true });
    } else {
      setTableState({ ...tableState, tableData: false, error: false, message: false, reload: false });
    }
  }, [query.query]);

  useAsyncEffect(
    async () => {
      if (query.query && query.lastUpdate) {
        if (controller) controller.abort();
        controller = new AbortController();
        setTableState({ ...tableState, loading: true });

        const response = await getQueryData({ query: query.query.replace(/\n/g, ' ').trim(), auth, url, signal: controller.signal, is_local, compute_stack_id, customer_id });

        if (response.error) {
          setTableState({ ...tableState, message: `Error fetching data: ${response.message}`, access_errors: response.access_errors, loading: false, error: true });
        } else if (response.message) {
          setTableState({ ...tableState, message: response.message, loading: false, error: false });
        } else {
          setTableState({
            ...tableState,
            tableData: response.tableData,
            totalRecords: response.totalRecords,
            dataTableColumns: response.dataTableColumns,
            totalPages: Math.ceil((response.tableData?.length || 20) / 20),
            loading: false,
            error: false,
            message: false,
            sorted: [],
          });
        }
      }
    },
    () => {
      if (controller) controller.abort();
    },
    [query, lastUpdate]
  );

  useInterval(() => {
    if (tableState.autoRefresh && !tableState.loading) setLastUpdate(Date.now());
  }, config.refresh_content_interval);

  return tableState.reload ? (
    <EmptyPrompt message="Executing Query" />
  ) : tableState.message ? (
    <EmptyPrompt error={tableState.error} message={tableState.message} accessErrors={tableState.access_errors} />
  ) : tableState.tableData && !tableState.tableData.length ? (
    <EmptyPrompt message="No records" />
  ) : tableState.tableData?.length ? (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <DataTableHeader
        totalRecords={tableState.totalRecords}
        loading={tableState.loading}
        showFilter={tableState.showFilter}
        filtered={tableState.filtered}
        toggleFilter={(newValues) => setTableState({ ...tableState, ...newValues })}
        autoRefresh={tableState.autoRefresh}
        setAutoRefresh={() => setTableState({ ...tableState, autoRefresh: !tableState.autoRefresh })}
        setLastUpdate={setLastUpdate}
        setShowChartModal={setShowChartModal}
      />
      <Card className="my-3">
        <CardBody className="react-table-holder">
          <DataTable
            columns={tableState.dataTableColumns}
            data={tableState.tableData}
            currentPage={tableState.page}
            pageSize={tableState.pageSize}
            totalPages={tableState.totalPages}
            showFilter={tableState.showFilter}
            sorted={tableState.sorted}
            loading={tableState.loading && !tableState.autoRefresh}
            onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
            onSortedChange={(value) => setTableState({ ...tableState, sorted: value })}
            onPageChange={(value) => setTableState({ ...tableState, pageSize: value })}
            onPageSizeChange={(value) => setTableState({ ...tableState, page: 0, pageSize: value })}
          />
        </CardBody>
      </Card>
      {showChartModal && <ChartModal setShowChartModal={setShowChartModal} tableData={tableState.tableData} query={query.query.replace(/\n/g, ' ').trim()} />}
    </ErrorBoundary>
  ) : (
    <EmptyPrompt message="Please execute a SQL query to proceed" />
  );
};

export default Datatable;
