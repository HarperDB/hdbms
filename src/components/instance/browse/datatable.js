import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import useInterval from 'use-interval';
import { Card, CardBody } from 'reactstrap';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';

import instanceState from '../../../functions/state/instanceState';

import config from '../../../config';
import DataTableHeader from './datatableHeader';
import getTableData from '../../../functions/instance/getTableData';
import DataTable from '../../shared/dataTable';

const Datatable = ({ tableState, setTableState, activeTable, defaultTableState }) => {
  const history = useHistory();
  const { compute_stack_id, schema, table, customer_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canFetch = mounted && !loading && !!activeTable && !!table;

  useEffect(() => {
    if (mounted) setLoading(false);
  }, [tableState.tableData, mounted]);

  useEffect(() => {
    if (schema && table && activeTable) {
      setTableState(defaultTableState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema, table]);

  useAsyncEffect(async () => {
    if (canFetch) {
      setLoading(true);
      const { newData, newTotalPages, newTotalRecords, newSorted, newEntityAttributes, hashAttribute, dataTableColumns, error } = await getTableData({
        schema,
        table,
        filtered: tableState.filtered,
        pageSize: tableState.pageSize,
        sorted: tableState.sorted,
        page: tableState.page,
        auth,
        url,
        is_local,
        compute_stack_id,
        customer_id,
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
      });
    }
  }, [tableState.sorted, tableState.page, tableState.filtered, tableState.pageSize, tableState.lastUpdate, activeTable, mounted]);

  useInterval(() => tableState.autoRefresh && setTableState({ ...tableState, lastUpdate: Date.now() }), config.refresh_content_interval);

  useAsyncEffect(
    () => setMounted(true),
    () => setMounted(false),
    []
  );

  return (
    <>
      <DataTableHeader
        totalRecords={tableState.totalRecords}
        loading={loading}
        autoRefresh={tableState.autoRefresh}
        refresh={() => setTableState({ ...tableState, lastUpdate: Date.now() })}
        toggleAutoRefresh={() => setTableState({ ...tableState, autoRefresh: !tableState.autoRefresh })}
        toggleFilter={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, page: 0, showFilter: !tableState.showFilter })}
      />
      <Card className="my-3">
        <CardBody>
          <DataTable
            manual
            columns={tableState.dataTableColumns}
            data={tableState.tableData}
            page={tableState.page}
            pageSize={tableState.pageSize}
            totalPages={tableState.totalPages}
            showFilter={tableState.showFilter}
            sorted={tableState.sorted}
            loading={loading && !tableState.autoRefresh}
            onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
            onSortedChange={(value) => setTableState({ ...tableState, sorted: value })}
            onPageChange={(value) => setTableState({ ...tableState, page: value })}
            onPageSizeChange={(value) => setTableState({ ...tableState, page: 0, pageSize: value })}
            onRowClick={(rowData) => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}/edit/${rowData[tableState.hashAttribute]}`)}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default Datatable;
