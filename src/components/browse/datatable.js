import React, { useState, useContext } from 'react';
import ReactTable from 'react-table';
import { useHistory, useParams } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';

import { HarperDBContext } from '../../providers/harperdb';
import commaNumbers from '../../util/commaNumbers';

export default ({ dataTableColumns, hashAttribute, onFilteredChange, filtered, onSortedChange, sorted, onPageChange, page }) => {
  const { queryHarperDB, refreshInstance, structure } = useContext(HarperDBContext);
  const history = useHistory();
  const { schema, table } = useParams();

  const [tableData, setTableData] = useState([]);
  const [pages, setTotalPages] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [pageSize, onPageSizeChange] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showFilter, toggleShowFilter] = useState(false);
  const [autoRefresh, toggleAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState();

  const dataRefreshInterval = 3000;
  let dataRefreshTimeout = false;
  let tableChangeTimeout = false;

  const loadNewData = async (showSpinner = true) => {
    setLoading(showSpinner);

    if (!sorted.length) return false;

    let newTotalPages = 1;
    let newTotalRecords = 0;
    let newData = [];

    try {
      let countSQL = `SELECT count(*) as newTotalRecords FROM ${schema}.${table} `;
      if (filtered.length) countSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      [{ newTotalRecords }] = await queryHarperDB({ operation: 'sql', sql: countSQL });
      newTotalPages = newTotalRecords && Math.ceil(newTotalRecords / pageSize);
    } catch (e) {
      // console.log('Failed to get row count');
    }

    try {
      let dataSQL = `SELECT * FROM ${schema}.${table} `;
      if (filtered.length) dataSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      if (sorted.length) dataSQL += `ORDER BY \`${sorted[0].id}\` ${sorted[0].desc ? 'DESC' : 'ASC'}`;
      dataSQL += ` LIMIT ${(page * pageSize) + pageSize} OFFSET ${page * pageSize}`;
      newData = await queryHarperDB({ operation: 'sql', sql: dataSQL });
    } catch (e) {
      // console.log('Failed to get table data');
    }

    if (newData) setTableData(newData);
    if (newTotalPages) setTotalPages(newTotalPages);
    setTotalRecords(newTotalRecords);
    return setLoading(false);
  };

  const handleRefreshClick = () => refreshInstance();

  const handleNewRecordClick = () => history.push(`/browse/${schema}/${table}/add`);

  const handleCSVUploadClick = () => history.push(`/browse/${schema}/${table}/csv`);

  const handleRowClick = (newActiveRecord) => history.push(`/browse/${schema}/${table}/edit/${newActiveRecord[hashAttribute]}`);

  const handleFilterClick = () => { if (showFilter) onFilteredChange([]); toggleShowFilter(!showFilter); };

  useAsyncEffect(
    () => {
      clearTimeout(tableChangeTimeout);
      tableChangeTimeout = setTimeout(() => loadNewData(), 0);
    },
    () => {
      clearTimeout(tableChangeTimeout);
    },
    [sorted, table, pageSize, page, filtered, structure],
  );

  useAsyncEffect(
    async () => {
      if (autoRefresh) {
        clearTimeout(dataRefreshTimeout);
        const [{ newTotalRecords }] = await queryHarperDB({
          operation: 'sql',
          sql: `SELECT count(*) as newTotalRecords FROM ${schema}.${table} `,
        });
        if (newTotalRecords !== totalRecords) {
          loadNewData(false);
          setTimeout(() => refreshInstance(), 100);
        }
        dataRefreshTimeout = setTimeout(() => setLastUpdate(Date.now()), dataRefreshInterval);
      }
    },
    () => clearTimeout(dataRefreshTimeout),
    [lastUpdate, autoRefresh],
  );

  return (
    <>
      <Row>
        <Col className="text-nowrap">
          <span className="text-bold text-white">
            <span>{schema} </span>
            <span>{table && `> ${table} > `} </span>
            {loading ? (
              <i className="fa fa-spinner fa-spin text-white" />
            ) : (
              <span>{commaNumbers(totalRecords)} record{totalRecords !== 1 ? 's' : ''}</span>
            )}
          </span>
        </Col>
        <Col className="text-right text-white">
          <i title={`Refresh table ${table}`} className="fa fa-refresh mr-2" onClick={handleRefreshClick} />
          <span className="mr-2">auto</span>
          <i title="Turn on autofresh" className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} onClick={() => toggleAutoRefresh(!autoRefresh)} />
          <span className="mx-3 text">|</span>
          <i title={`Filter table ${table}`} className="fa fa-search mr-3" onClick={handleFilterClick} />
          <i title={`Add new record to table ${table}`} className="fa fa-plus mr-3" onClick={handleNewRecordClick} />
          <i title={`Bulk Upload CSV to ${table}`} className="fa fa-file-text-o" onClick={handleCSVUploadClick} />
        </Col>
      </Row>
      <Card className="mb-3 mt-2">
        <CardBody>
          <ReactTable
            manual
            data={tableData}
            pages={pages}
            columns={dataTableColumns}
            filterable={showFilter}
            filtered={filtered}
            onFilteredChange={onFilteredChange}
            page={page}
            onPageChange={onPageChange}
            sorted={sorted}
            onSortedChange={onSortedChange}
            defaultPageSize={pageSize}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            getTrProps={(state, rowInfo) => ({ onClick: () => handleRowClick(rowInfo.original) })}
          />
        </CardBody>
      </Card>
    </>
  );
};
