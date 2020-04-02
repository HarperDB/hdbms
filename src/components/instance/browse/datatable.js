import React from 'react';
import ReactTable from 'react-table';
import { useHistory, useParams } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import config from '../../../../config';

import instanceState from '../../../state/stores/instanceState';
import tableState from '../../../state/stores/tableState';

import commaNumbers from '../../../util/commaNumbers';
import getTableData from '../../../api/instance/getTableData';

export default ({ activeTable: { hashAttribute, dataTableColumns } }) => {
  const history = useHistory();
  const { compute_stack_id, schema, table } = useParams();
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));
  const { filtered, sorted, page, loading, tableData, currentTable, currentHash, totalPages, totalRecords, pageSize, autoRefresh, showFilter, lastUpdate } = useStoreState(
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
      lastUpdate: s.lastUpdate,
      currentTable: s.currentTable,
      currentHash: s.currentHash,
    })
  );

  useAsyncEffect(async () => {
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
    });

    tableState.update((s) => {
      s.tableData = newData;
      s.totalPages = newTotalPages;
      s.totalRecords = newTotalRecords;
      s.loading = false;
    });
  }, [sorted, page, filtered, pageSize, lastUpdate]);

  useAsyncEffect(() => {
    if (table !== currentTable || hashAttribute !== currentHash) {
      tableState.update((s) => {
        s.filtered = [];
        s.sorted = [{ id: hashAttribute, desc: false }];
        s.page = 0;
        s.currentTable = table;
        s.currentHash = hashAttribute;
      });
    }
  }, [hashAttribute]);

  useInterval(() => {
    if (autoRefresh) {
      tableState.update((s) => {
        s.lastUpdate = Date.now();
      });
    }
  }, config.instance_refresh_rate);

  return (
    <>
      <Row>
        <Col className="text-nowrap text-left">
          <span className="text-white floating-card-header">
            <span>
              {schema}
              &nbsp;
            </span>
            <span>{table && `> ${table} > `} </span>
            <span>
              {commaNumbers(totalRecords)} record
              {totalRecords !== 1 ? 's' : ''}
            </span>
          </span>
        </Col>
        <Col xs="12" className="d-inline-flex d-md-none mb-2" />
        <Col className="text-md-right text-white text-nowrap">
          <i
            title={`Refresh table ${table}`}
            className={`fa floating-card-header mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`}
            onClick={() =>
              instanceState.update((s) => {
                s.lastUpdate = Date.now();
              })
            }
          />
          <span className="mr-2">auto</span>
          <i
            title="Turn on autofresh"
            className={`floating-card-header fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`}
            onClick={() =>
              tableState.update((s) => {
                s.autoRefresh = !autoRefresh;
                s.lastUpdate = Date.now();
              })
            }
          />
          <span className="mx-3 text">|</span>
          <i
            title={`Filter table ${table}`}
            className="floating-card-header fa fa-search mr-3"
            onClick={() =>
              tableState.update((s) => {
                s.filtered = showFilter ? [] : filtered;
                s.page = 0;
                s.showFilter = !showFilter;
              })
            }
          />
          <i
            title={`Add new record to table ${table}`}
            className="floating-card-header fa fa-plus mr-3"
            onClick={() => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}/add`)}
          />
          <i
            title={`Bulk Upload CSV to ${table}`}
            className="floating-card-header fa fa-file-text-o"
            onClick={() => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}/csv`)}
          />
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className="react-table-holder">
          <ReactTable
            manual
            loading={loading}
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
