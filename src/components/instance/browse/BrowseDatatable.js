import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import useInterval from 'use-interval';
import { Card, CardBody } from 'reactstrap';
import { useStoreState } from 'pullstate';

import instanceState from '../../../functions/state/instanceState';

import config from '../../../config';
import DataTableHeader from './BrowseDatatableHeader';
import getTableData from '../../../functions/instance/getTableData';
import DataTable from '../../shared/DataTable';

let controller;

const BrowseDatatable = ({ tableState, setTableState, activeTable, defaultTableState }) => {
  const history = useHistory();
  const { compute_stack_id, schema, table, customer_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
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
        is_local,
        compute_stack_id,
        customer_id,
        signal: controller.signal,
      });
      if (isMounted) {
        setLoading(false);
        if (!newData.error) {
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
      }
    };

    if (auth) fetchData();

    return () => {
      controller?.abort();
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableState.sorted, tableState.page, tableState.filtered, tableState.pageSize, lastUpdate]);

  useEffect(() => {
    if (activeTable) {
      setLastUpdate(Date.now());
    }
  }, [activeTable]);

  useInterval(() => tableState.autoRefresh && setLastUpdate(Date.now()), config.refresh_content_interval);

  return (
    <>
      <DataTableHeader
        totalRecords={tableState.totalRecords}
        loading={loading}
        autoRefresh={tableState.autoRefresh}
        refresh={() => setLastUpdate(Date.now())}
        toggleAutoRefresh={() => setTableState({ ...tableState, autoRefresh: !tableState.autoRefresh })}
        toggleFilter={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, page: 0, showFilter: !tableState.showFilter })}
      />
      <Card className="my-3">
        <CardBody className="react-table-holder">
          <DataTable
            manual
            columns={tableState.dataTableColumns || []}
            data={tableState.tableData || []}
            currentPage={tableState.page}
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

export default BrowseDatatable;
