import React, { useState } from 'react';
import ReactTable from 'react-table';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';
import { Card, CardBody } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import config from '../../../../config';
import instanceState from '../../../state/instanceState';
import DataTableHeader from './datatableHeader';
import getQueryData from '../../../methods/instance/getQueryData';
import EmptyPrompt from './emptyPrompt';

const defaultTableState = {
  tableData: [],
  totalPages: -1,
  totalRecords: 0,
  loading: false,
  filtered: [],
  sorted: [],
  autoRefresh: false,
  showFilter: false,
  dataTableColumns: [],
  error: false,
  message: false,
  reload: false,
  accessErrors: false,
};

export default ({ query }) => {
  const [lastUpdate, setLastUpdate] = useState();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const [tableState, setTableState] = useState(defaultTableState);
  let controller;

  useAsyncEffect(() => {
    if (query.query) {
      setTableState({ ...defaultTableState, reload: true });
    } else {
      setTableState({ ...tableState, error: false, message: false, reload: false });
    }
  }, [query.query]);

  useAsyncEffect(
    async () => {
      if (query.query && query.lastUpdate) {
        if (controller) controller.abort();
        controller = new AbortController();
        setTableState({ ...tableState, loading: true });

        const response = await getQueryData({ query: query.query.replace(/\n/g, ' ').trim(), auth, url, signal: controller.signal });

        if (response.error) {
          setTableState({ ...tableState, message: `Error fetching data: ${response.message}`, access_errors: response.access_errors, loading: false, error: true, reload: false });
        } else if (response.message) {
          setTableState({ ...tableState, message: response.message, loading: false, error: false, reload: false });
        } else if (!response.tableData.length) {
          setTableState({ ...tableState, message: 'Your query produced no results', loading: false, error: false, reload: false });
        } else {
          const sortable = query.query.toLowerCase().indexOf('order by') === -1;
          setTableState({
            ...tableState,
            tableData: response.tableData,
            totalRecords: response.totalRecords,
            dataTableColumns: response.dataTableColumns,
            loading: false,
            error: false,
            message: false,
            reload: false,
            sorted: sortable ? [{ id: response.dataTableColumns[0].accessor, desc: (tableState.sorted && tableState.sorted[0]?.desc) || false }] : [],
            sortable,
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
  }, config.instance_refresh_rate);

  return tableState.reload ? (
    <EmptyPrompt message="Executing Query" />
  ) : tableState.message ? (
    <EmptyPrompt error={tableState.error} message={tableState.message} accessErrors={tableState.access_errors} />
  ) : tableState.tableData?.length ? (
    <>
      <DataTableHeader
        totalRecords={tableState.totalRecords}
        loading={tableState.loading}
        autoRefresh={tableState.autoRefresh}
        setAutoRefresh={() => setTableState({ ...tableState, autoRefresh: !tableState.autoRefresh })}
        showFilter={tableState.showFilter}
        filtered={tableState.filtered}
        toggleFilter={(newValues) => setTableState({ ...tableState, ...newValues })}
        setLastUpdate={setLastUpdate}
      />
      <Card className="my-3">
        <CardBody className="react-table-holder">
          <ReactTable
            sortable={tableState.sortable}
            loading={tableState.loading && !tableState.autoRefresh}
            loadingText="loading"
            data={tableState.tableData}
            columns={tableState.dataTableColumns}
            onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
            filtered={tableState.filtered}
            onSortedChange={(value) => setTableState({ ...tableState, sorted: value })}
            sorted={tableState.sorted}
            onPageChange={(value) => setTableState({ ...tableState, page: value })}
            filterable={tableState.showFilter}
            defaultPageSize={tableState.pageSize}
            pageSize={tableState.pageSize}
            onPageSizeChange={(value) => setTableState({ ...tableState, pageSize: value })}
          />
        </CardBody>
      </Card>
    </>
  ) : (
    <EmptyPrompt message="Please execute a SQL query to proceed" />
  );
};
