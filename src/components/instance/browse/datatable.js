import React, { useState } from 'react';
import ReactTable from 'react-table';
import { useHistory, useParams } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';
import { Card, CardBody } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import config from '../../../../config';
import instanceState from '../../../state/instanceState';
import DataTableHeader from './datatableHeader';
import getTableData from '../../../methods/instance/getTableData';

const defaultTableState = {
  tableData: [],
  totalPages: -1,
  totalRecords: 0,
  loading: false,
  filtered: [],
  sorted: [],
  page: 0,
  pageSize: 20,
  autoRefresh: false,
  showFilter: false,
  currentTable: false,
  currentHash: false,
};

export default ({ activeTable: { hashAttribute, dataTableColumns } }) => {
  const history = useHistory();
  const { compute_stack_id, schema, table } = useParams();
  const { auth, url, lastUpdate } = useStoreState(instanceState, (s) => ({ auth: s.auth, url: s.url, lastUpdate: s.lastUpdate }));
  const [tableState, setTableState] = useState(defaultTableState);

  let controller;

  useAsyncEffect(
    async () => {
      if (controller) controller.abort();

      if (!tableState.loading) {
        controller = new AbortController();

        setTableState({ ...tableState, loading: true });

        const { newData, newTotalPages, newTotalRecords } = await getTableData({
          schema,
          table,
          filtered: tableState.filtered,
          pageSize: tableState.pageSize,
          sorted: tableState.sorted,
          page: tableState.page,
          auth,
          url,
          signal: controller.signal,
        });

        setTableState({
          ...tableState,
          tableData: newData,
          totalPages: newTotalPages,
          totalRecords: newTotalRecords,
          loading: false,
        });
      }
    },
    () => controller?.abort(),
    [tableState.sorted, tableState.page, tableState.filtered, tableState.pageSize, lastUpdate]
  );

  useAsyncEffect(() => {
    if (hashAttribute !== tableState.currentHash || table !== tableState.currentTable) {
      setTableState({
        ...defaultTableState,
        sorted: [{ id: hashAttribute, desc: false }],
        currentTable: table,
        currentHash: hashAttribute,
      });
    }
  }, [hashAttribute, table]);

  useInterval(() => {
    if (tableState.autoRefresh && !tableState.loading) {
      instanceState.update((s) => {
        s.lastUpdate = Date.now();
      });
    }
  }, config.instance_refresh_rate);

  useAsyncEffect(
    () => false,
    () => {
      if (controller) controller.abort();
      setTableState(defaultTableState);
    },
    []
  );

  return (
    <>
      <DataTableHeader
        totalRecords={tableState.totalRecords}
        loading={tableState.loading}
        autoRefresh={tableState.autoRefresh}
        toggleAutoRefresh={() => setTableState({ ...tableState, autoRefresh: !tableState.autoRefresh })}
        toggleFilter={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, page: 0, showFilter: !tableState.showFilter })}
      />
      <Card className="my-3">
        <CardBody className="react-table-holder">
          <ReactTable
            manual
            loading={tableState.loading && !tableState.autoRefresh}
            loadingText="loading"
            data={tableState.tableData}
            pages={tableState.totalPages}
            columns={dataTableColumns}
            hashAttribute={hashAttribute}
            onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
            filtered={tableState.filtered}
            onSortedChange={(value) => setTableState({ ...tableState, sorted: value })}
            sorted={tableState.sorted}
            onPageChange={(value) => setTableState({ ...tableState, page: value })}
            page={tableState.page}
            filterable={tableState.showFilter}
            defaultPageSize={tableState.pageSize}
            pageSize={tableState.pageSize}
            onPageSizeChange={(value) => setTableState({ ...tableState, pageSize: value })}
            getTrProps={(state, rowInfo) => ({ onClick: () => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}/edit/${rowInfo.original[hashAttribute]}`) })}
          />
        </CardBody>
      </Card>
    </>
  );
};
