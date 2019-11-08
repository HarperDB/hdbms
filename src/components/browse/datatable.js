import React, { useState, useContext, useEffect } from 'react';
import ReactTable from 'react-table';
import { useHistory, useParams } from 'react-router';
import useAsyncEffect from 'use-async-effect';

import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { HarperDBContext } from '../../providers/harperdb';
import isImage from '../../util/isImage';

export default ({ dataTableColumns, hashAttribute, update, onFilteredChange, filtered, onSortedChange, sorted, onPageChange, page }) => {
  const { queryTableData, structure } = useContext(HarperDBContext);
  const history = useHistory();
  const { schema, table } = useParams();

  const [tableData, setTableData] = useState([]);
  const [pages, setTotalPages] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [pageSize, onPageSizeChange] = useState(20);
  const [totalRecords, setTotalRecords] = useState(false);
  const [showFilter, toggleShowFilter] = useState(false);

  const loadNewData = async () => {
    setLoading(true);
    setTotalRecords('loading');
    const { newData, newTotalPages, newTotalRecords } = await queryTableData({ schema, table, pageSize, page, filtered, sorted });
    if (newData) setTableData(newData);
    if (newTotalPages) setTotalPages(newTotalPages);
    if (newTotalRecords) setTotalRecords(newTotalRecords.toString());
    setLoading(false);
  };

  let tableChangeTimeout = false;
  useAsyncEffect(
    () => {
      clearTimeout(tableChangeTimeout);
      tableChangeTimeout = setTimeout(() => loadNewData(), 0);
    },
    () => clearTimeout(tableChangeTimeout),
    [sorted, table, pageSize, page, filtered, structure],
  );

  useEffect(() => setTotalRecords(false), [table]);

  const handleFilterClick = () => {
    if (showFilter) onFilteredChange([]);
    toggleShowFilter(!showFilter);
  };

  const handleRefreshClick = () => update(Date.now());

  const handleNewRecordClick = () => history.push(`/browse/${schema}/${table}/add`);

  const handleCSVUploadClick = () => history.push(`/browse/${schema}/${table}/csv`);

  const handleRowClick = (newActiveRecord) => history.push(`/browse/${schema}/${table}/edit/${newActiveRecord[hashAttribute]}`);

  return (
    <>
      <Row>
        <Col className="text-nowrap">
          <span className="text-bold text-white">{schema} {table && `> ${table} > `} {totalRecords && `${totalRecords.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} record${totalRecords !== '1' ? 's' : ''}`}&nbsp;</span>
        </Col>
        <Col className="text-right">
          <i title={`Refresh table ${table}`} className="fa fa-refresh text-white mr-2" onClick={handleRefreshClick} />
          <i title={`Filter table ${table}`} className="fa fa-search text-white mr-2" onClick={handleFilterClick} />
          <i title={`Add new record to table ${table}`} className="fa fa-plus text-white mr-2" onClick={handleNewRecordClick} />
          <i title={`Bulk Upload CSV to ${table}`} className="fa fa-file-text-o text-white" onClick={handleCSVUploadClick} />
        </Col>
      </Row>
      <Card className="mb-3 mt-2">
        <CardBody>
          <ReactTable
            manual
            loading={loading}
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
