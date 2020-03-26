import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import { useHistory, useParams } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import config from '../../../../config';

import commaNumbers from '../../../util/commaNumbers';
import getTableData from '../../../api/instance/getTableData';
import defaultTableState from '../../../state/defaultTableState';
import instanceState from '../../../state/stores/instanceState';

let tableChangeTimeout = false;

export default ({ activeTable: { hashAttribute, dataTableColumns } }) => {
  const history = useHistory();
  const { compute_stack_id, schema, table } = useParams();
  const { structure, auth, url } = useStoreState(instanceState, (s) => ({
    structure: s.structure,
    auth: s.auth,
    url: s.url,
  }));
  const [tableState, setTableState] = useState(defaultTableState);

  useAsyncEffect(
    async () => {
      clearTimeout(tableChangeTimeout);
      tableChangeTimeout = setTimeout(async () => {
        setTableState({ ...tableState, loading: true });
        const newData = await getTableData({ schema, table, tableState, auth, url });
        setTableState({ ...tableState, tableData: newData.tableData, totalPages: newData.totalPages, totalRecords: newData.totalRecords, loading: false });
      }, 500);
    },
    () => {
      clearTimeout(tableChangeTimeout);
    },
    [table, structure, tableState.sorted, tableState.page, tableState.filtered, tableState.pageSize, tableState.lastUpdate],
  );

  useEffect(() => {
    if (table) {
      setTableState({ ...tableState, filtered: [], sorted: [{ id: hashAttribute, desc: false }], page: 0 });
    }
  }, [table]);

  useInterval(() => {
    if (tableState.autoRefresh) {
      setTableState({ ...tableState, lastUpdate: Date.now() });
    }
  }, config.instance_refresh_rate);

  return (
    <>
      <Row>
        <Col className="text-nowrap text-left">
          <span className="text-white floating-card-header">
            <span>{schema}&nbsp;</span>
            <span>{table && `> ${table} > `} </span>
            <span>{commaNumbers(tableState.totalRecords)} record{tableState.totalRecords !== 1 ? 's' : ''}</span>
          </span>
        </Col>
        <Col xs="12" className="d-inline-flex d-md-none mb-2" />
        <Col className="text-md-right text-white text-nowrap">
          <i title={`Refresh table ${table}`} className={`fa floating-card-header mr-2 ${tableState.loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} onClick={() => instanceState.update((s) => { s.lastUpdate = Date.now(); })} />
          <span className="mr-2">auto</span>
          <i title="Turn on autofresh" className={`floating-card-header fa fa-lg fa-toggle-${tableState.autoRefresh ? 'on' : 'off'}`} onClick={() => setTableState({ ...tableState, autoRefresh: !tableState.autoRefresh, lastUpdate: Date.now() })} />
          <span className="mx-3 text">|</span>
          <i title={`Filter table ${table}`} className="floating-card-header fa fa-search mr-3" onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })} />
          <i title={`Add new record to table ${table}`} className="floating-card-header fa fa-plus mr-3" onClick={() => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}/add`)} />
          <i title={`Bulk Upload CSV to ${table}`} className="floating-card-header fa fa-file-text-o" onClick={() => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}/csv`)} />
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className="react-table-holder">
          <ReactTable
            manual
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
