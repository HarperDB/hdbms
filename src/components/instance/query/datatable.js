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
import EmptyPrompt from './emptyPrompt';

export default ({ query }) => {
  const [lastUpdate, setLastUpdate] = useState();
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));
  const { filtered, sorted, loading, tableData, totalRecords, pageSize, autoRefresh, showFilter, dataTableColumns, error, message, reload } = useStoreState(
    tableState,
    (s) => ({
      filtered: s.filtered,
      sorted: s.sorted,
      loading: s.loading,
      tableData: s.tableData,
      totalRecords: s.totalRecords,
      pageSize: s.pageSize,
      autoRefresh: s.autoRefresh,
      showFilter: s.showFilter,
      dataTableColumns: s.dataTableColumns,
      error: s.error,
      message: s.message,
      reload: s.reload,
    }),
    [query.query]
  );
  let controller;

  useAsyncEffect(() => {
    if (query.query) {
      tableState.update((s) => {
        s.tableData = [];
        s.totalPages = -1;
        s.totalRecords = 0;
        s.loading = false;
        s.filtered = [];
        s.sorted = [];
        s.autoRefresh = false;
        s.showFilter = false;
        s.dataTableColumns = [];
        s.error = false;
        s.message = false;
        s.reload = true;
      });
    } else {
      tableState.update((s) => {
        s.error = false;
        s.message = false;
        s.reload = false;
      });
    }
  }, [query.query]);

  useAsyncEffect(
    async () => {
      if (query.query && query.lastUpdate) {
        if (controller) controller.abort();

        controller = new AbortController();

        tableState.update((s) => {
          s.loading = true;
        });

        const response = await getQueryData({
          query: query.query.replace(/\n/g, ' ').trim(),
          auth,
          url,
          signal: controller.signal,
        });

        if (response.error) {
          tableState.update((s) => {
            s.loading = false;
            s.message = `Error fetching data: ${response.message}`;
            s.error = true;
            s.reload = false;
          });
        } else if (response.message) {
          tableState.update((s) => {
            s.loading = false;
            s.message = response.message;
            s.error = false;
            s.reload = false;
          });
        } else {
          const sortFromQuery = query.query.toLowerCase().indexOf('order by') !== -1;
          let newSort = false;
          if (sortFromQuery) {
            const queryOrderBy = query.query.toLowerCase().split('order by')[1].trim().split(' ');
            const hasTableRef = queryOrderBy[0].indexOf('.') !== -1;
            const queryOrderId = hasTableRef ? queryOrderBy[0].split('.')[1] : queryOrderBy[0];
            const queryOrderDesc = queryOrderBy[1]?.toLowerCase() === 'desc';
            newSort = [{ id: queryOrderId, desc: queryOrderDesc }];
          }

          tableState.update((s) => {
            s.tableData = response.tableData;
            s.totalRecords = response.totalRecords;
            s.dataTableColumns = response.dataTableColumns;
            s.loading = false;
            s.error = false;
            s.message = false;
            s.reload = false;
            s.sorted = newSort || [{ id: response.dataTableColumns[0].accessor, desc: s.sorted[0]?.desc || false }];
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
    if (autoRefresh && !loading) {
      setLastUpdate(Date.now());
    }
  }, config.instance_refresh_rate);

  return reload ? (
    <EmptyPrompt message="Executing Query" />
  ) : message ? (
    <EmptyPrompt error={error} message={message} />
  ) : query ? (
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
  ) : (
    <EmptyPrompt message="Please execute a SQL query to proceed" />
  );
};
