import React, { useEffect } from 'react';
import ReactTable from 'react-table';
import { useHistory, useParams } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';
import { Card, CardBody } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import config from '../../../../config';

import instanceState from '../../../state/stores/instanceState';
import tableState from '../../../state/stores/tableState';

import DataTableHeader from './datatableHeader';
import getTableData from '../../../api/instance/getTableData';

export default ({ activeTable: { hashAttribute, dataTableColumns } }) => {
  const history = useHistory();
  const { compute_stack_id, schema, table } = useParams();
  const { auth, url, lastUpdate } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    lastUpdate: s.lastUpdate,
  }));
  const { filtered, sorted, page, loading, tableData, currentTable, currentHash, totalPages, totalRecords, pageSize, autoRefresh, showFilter } = useStoreState(
    tableState,
    (s) => ({
      filtered: s.filtered,
      sorted: s.sorted,
      page: s.page,
      loading: s.loading,
      tableData: s.tableData,
      totalPages: s.totalPages,
      totalRecords: s.totalRecords,
      pageSize: s.pageSize,
      autoRefresh: s.autoRefresh,
      showFilter: s.showFilter,
      currentTable: s.currentTable,
      currentHash: s.currentHash,
    }),
    [table]
  );
  let controller;

  useAsyncEffect(
    async () => {
      if (controller) {
        controller.abort();
      }
      if (!loading) {
        controller = new AbortController();

        tableState.update((s) => {
          s.loading = true;
        });

        const { newData, newTotalPages, newTotalRecords } = await getTableData({
          schema,
          table,
          filtered,
          pageSize,
          sorted,
          page,
          auth,
          url,
          signal: controller.signal,
        });

        tableState.update((s) => {
          s.tableData = newData;
          s.totalPages = newTotalPages;
          s.totalRecords = newTotalRecords;
          s.loading = false;
        });
      }
    },
    () => controller?.abort(),
    [sorted, page, filtered, pageSize, lastUpdate]
  );

  useAsyncEffect(() => {
    if (hashAttribute !== currentHash || table !== currentTable) {
      tableState.update((s) => {
        s.tableData = [];
        s.totalPages = -1;
        s.totalRecords = 0;
        s.loading = false;
        s.filtered = [];
        s.sorted = [{ id: hashAttribute, desc: false }];
        s.page = 0;
        s.currentTable = table;
        s.currentHash = hashAttribute;
      });
    }
  }, [hashAttribute, table]);

  useInterval(() => {
    if (autoRefresh && !loading) {
      instanceState.update((s) => {
        s.lastUpdate = Date.now();
      });
    }
  }, config.instance_refresh_rate);

  return (
    <>
      <DataTableHeader totalRecords={totalRecords} loading={loading} autoRefresh={autoRefresh} showFilter={showFilter} filtered={filtered} />
      <Card className="my-3">
        <CardBody className="react-table-holder">
          <ReactTable
            manual
            loading={loading && !autoRefresh}
            loadingText="loading"
            data={tableData}
            pages={totalPages}
            columns={dataTableColumns}
            hashAttribute={hashAttribute}
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
            getTrProps={(state, rowInfo) => ({
              onClick: () => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}/edit/${rowInfo.original[hashAttribute]}`),
            })}
          />
        </CardBody>
      </Card>
    </>
  );
};
