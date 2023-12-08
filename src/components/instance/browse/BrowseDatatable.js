import React, { useState, useEffect } from 'react';
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

let controller;
let controller2;
let controller3;

function BrowseDatatable({ tableState, setTableState, activeTable }) {
  const navigate = useNavigate();
  const { compute_stack_id, schema, table, customer_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const [totalPages, setTotalPages] = useState(false);
  const [totalRecords, setTotalRecords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(true);

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
      const { newData, newTotalRecords, newTotalPages, newEntityAttributes, hashAttribute, dataTableColumns, error } = await getTableData({
        schema,
        table,
        filtered: tableState.filtered,
        pageSize: tableState.pageSize,
        sorted: tableState.sorted,
        page: tableState.page,
        auth,
        url,
        signal: controller.signal,
        signal2: controller2.signal,
      });

      if (isMounted) {
        setLoading(false);
        if (!newData.error) {
          if (!tableState.filtered.length) {
            setTotalPages(newTotalPages);
            setTotalRecords(newTotalRecords);
          } else if (newData.length < tableState.pageSize) {
            setTotalPages(1);
            setTotalRecords(newData.length);
          } else {
            fetchPagination();
          }
          setTableState({
            ...tableState,
            tableData: newData,
            newEntityAttributes,
            hashAttribute,
            dataTableColumns,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableState.sorted, tableState.page, tableState.filtered, tableState.pageSize, lastUpdate, activeTable]);

  useInterval(() => tableState.autoRefresh && setLastUpdate(Date.now()), config.refresh_content_interval);

  return (
    <>
      <DataTableHeader
        totalRecords={totalRecords}
        loading={loading}
        loadingFilter={loadingFilter}
        autoRefresh={tableState.autoRefresh}
        refresh={() => setLastUpdate(Date.now())}
        toggleAutoRefresh={() => setTableState({ ...tableState, autoRefresh: !tableState.autoRefresh })}
        toggleFilter={() => setTableState({ ...tableState, showFilter: !tableState.showFilter })}
      />
      <Card className="my-3">
        <CardBody className="react-table-holder">
          <DataTable
            manual
            columns={tableState.dataTableColumns || []}
            data={tableState.tableData || []}
            currentPage={tableState.page}
            pageSize={tableState.pageSize}
            totalPages={totalPages || 0}
            showFilter={tableState.showFilter}
            sorted={tableState.sorted.length ? tableState.sorted : [{ id: tableState.hashAttribute, desc: false }]}
            loading={loading && !tableState.autoRefresh}
            onFilteredChange={(value) => {
              setTableState({ ...tableState, page: 0, filtered: value });
            }}
            onSortedChange={(value) => setTableState({ ...tableState, page: 0, sorted: value })}
            onPageChange={(value) => setTableState({ ...tableState, page: value })}
            onPageSizeChange={(value) => setTableState({ ...tableState, page: 0, pageSize: value })}
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
