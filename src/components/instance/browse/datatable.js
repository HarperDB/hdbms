import React from 'react';
import ReactTable from 'react-table';
import { useHistory, useParams } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';
import { Card, CardBody } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import instanceState from '../../../state/instanceState';

import config from '../../../../config';
import DataTableHeader from './datatableHeader';
import getTableData from '../../../methods/instance/getTableData';

export default ({ tableState, setTableState, activeTable }) => {
  const history = useHistory();
  const { compute_stack_id, schema, table, customer_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  let controller;

  useAsyncEffect(async () => {
    if (controller) controller.abort();
    if (activeTable && !tableState.loading) {
      setTableState({ ...tableState, loading: true });
      controller = new AbortController();
      const { newData, newTotalPages, newTotalRecords, newSorted, newEntityAttributes, hashAttribute, dataTableColumns, error } = await getTableData({
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
        sorted: newSorted,
        newEntityAttributes,
        hashAttribute,
        dataTableColumns,
        error,
        loading: false,
      });
    }
  }, [tableState.sorted, tableState.page, tableState.filtered, tableState.pageSize, tableState.lastUpdate]);

  useAsyncEffect(
    () => false,
    () => controller && controller.abort(),
    []
  );

  useAsyncEffect(() => activeTable && setTableState({ ...tableState, lastUpdate: Date.now() }), [activeTable]);

  useInterval(() => tableState.autoRefresh && !tableState.loading && setTableState({ ...tableState, lastUpdate: Date.now() }), config.refresh_content_interval);

  return (
    <>
      <DataTableHeader
        totalRecords={tableState.totalRecords}
        loading={tableState.loading}
        autoRefresh={tableState.autoRefresh}
        refresh={() => setTableState({ ...tableState, lastUpdate: Date.now() })}
        toggleAutoRefresh={() => setTableState({ ...tableState, autoRefresh: !tableState.autoRefresh })}
        toggleFilter={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, page: 0, showFilter: !tableState.showFilter })}
      />
      <Card className="my-3">
        <CardBody className="react-table-holder">
          {tableState.error ? (
            <div className="text-center py-5">{tableState.error}</div>
          ) : (
            <ReactTable
              manual
              loading={tableState.loading && !tableState.autoRefresh}
              loadingText="loading"
              data={tableState.tableData}
              pages={tableState.totalPages}
              columns={tableState.dataTableColumns}
              hashAttribute={tableState.hashAttribute}
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
              getTrProps={(state, rowInfo) => ({
                onClick: () => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}/edit/${rowInfo.original[tableState.hashAttribute]}`),
              })}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};
