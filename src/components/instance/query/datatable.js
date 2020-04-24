import React, { useState } from 'react';
import ReactTable from 'react-table';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';
import { Card, CardBody } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import config from '../../../../config';

import instanceState from '../../../state/instanceState';
import tableState from '../../../state/tableState';

import DataTableHeader from './datatableHeader';
import getQueryData from '../../../methods/instance/getQueryData';

export default ({ query }) => {
  const [lastUpdate, setLastUpdate] = useState();
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));
  const { filtered, sorted, page, loading, tableData, totalRecords, pageSize, autoRefresh, showFilter, dataTableColumns } = useStoreState(
    tableState,
    (s) => ({
      filtered: s.filtered,
      sorted: s.sorted,
      page: s.page,
      loading: s.loading,
      tableData: s.tableData,
      totalRecords: s.totalRecords,
      pageSize: s.pageSize,
      autoRefresh: s.autoRefresh,
      showFilter: s.showFilter,
      dataTableColumns: s.dataTableColumns,
    }),
    [query.query]
  );
  let controller;

  useAsyncEffect(() => {
    tableState.update((s) => {
      s.tableData = [];
      s.totalPages = -1;
      s.totalRecords = 0;
      s.loading = true;
      s.filtered = [];
      s.sorted = [];
      s.page = 0;
      s.autoRefresh = false;
      s.showFilter = false;
      s.dataTableColumns = [];
    });
  }, [query.query]);

  useAsyncEffect(
    async () => {
      if (controller) controller.abort();

      controller = new AbortController();

      tableState.update((s) => {
        s.loading = true;
      });

      const { newData, newTotalRecords, newDataTableColumns } = await getQueryData({
        query: query.query,
        filtered,
        pageSize,
        sorted,
        page,
        auth,
        url,
        signal: controller.signal,
      });

      const sortFromQuery = query.query.toLowerCase().indexOf('order by') !== -1;
      let newSort = false;
      if (sortFromQuery) {
        const queryOrderBy = query.query.toLowerCase().split('order by')[1].trim().split(' ');
        const hasTableRef = queryOrderBy[0].indexOf('.') !== -1;
        const queryOrderId = hasTableRef ? queryOrderBy[0].split('.')[1] : queryOrderBy[0];
        const queryOrderDesc = queryOrderBy[1].toLowerCase() === 'desc';
        newSort = [{ id: queryOrderId, desc: queryOrderDesc }];
      }

      tableState.update((s) => {
        s.tableData = newData;
        s.totalRecords = newTotalRecords;
        s.dataTableColumns = newDataTableColumns;
        s.loading = false;
        s.sorted = newSort || [{ id: newDataTableColumns[0].accessor, desc: s.sorted[0]?.desc || false }];
      });
    },
    () => controller?.abort(),
    [query, lastUpdate]
  );

  useInterval(() => {
    if (autoRefresh && !loading) {
      setLastUpdate(Date.now());
    }
  }, config.instance_refresh_rate);

  return (
    <>
      <DataTableHeader totalRecords={totalRecords} loading={loading} autoRefresh={autoRefresh} showFilter={showFilter} filtered={filtered} setLastUpdate={setLastUpdate} />
      <Card className="my-3">
        <CardBody className="react-table-holder">
          <ReactTable
            loading={loading && !autoRefresh}
            loadingText="loading"
            data={tableData}
            columns={dataTableColumns}
            onFilteredChange={(value) =>
              tableState.update((s) => {
                s.filtered = value;
              })
            }
            filtered={filtered}
            onSortedChange={(value) =>
              tableState.update((s) => {
                s.sorted = value;
              })
            }
            sorted={sorted}
            onPageChange={(value) =>
              tableState.update((s) => {
                s.page = value;
              })
            }
            page={page}
            filterable={showFilter}
            defaultPageSize={pageSize}
            pageSize={pageSize}
            onPageSizeChange={(value) =>
              tableState.update((s) => {
                s.pageSize = value;
              })
            }
          />
        </CardBody>
      </Card>
    </>
  );
};
