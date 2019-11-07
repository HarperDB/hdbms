import React, { useState, useContext } from 'react';
import ReactTable from 'react-table';
import useAsyncEffect from 'use-async-effect';
import { useHistory, useParams } from 'react-router';

import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { HarperDBContext } from '../../providers/harperdb';

export default ({ dataTableColumns, hashAttribute, update }) => {
  const { queryTableData, structure } = useContext(HarperDBContext);
  const history = useHistory();
  const { schema, table } = useParams();

  const [tableData, setTableData] = useState([]);
  const [pages, setTotalPages] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [filtered, onFilteredChange] = useState([]);
  const [sorted, onSortedChange] = useState([{ id: hashAttribute, desc: false }]);
  const [pageSize, onPageSizeChange] = useState(20);
  const [page, onPageChange] = useState(0);
  const [showFilter, toggleShowFilter] = useState(false);

  useAsyncEffect(async () => {
    setLoading(true);
    const { newData, newTotalPages } = await queryTableData({ schema, table, pageSize, page, filtered, sorted });
    setTableData(newData);
    setTotalPages(newTotalPages);
    setLoading(false);
  }, [table, pageSize, page, filtered, sorted, structure]);

  const handleFilterClick = () => {
    if (showFilter) onFilteredChange([]);
    toggleShowFilter(!showFilter);
  };

  const handleRefreshClick = () => update(Date.now());

  const handleNewRecordClick = () => history.push(`/browse/${schema}/${table}/add`);

  const handleRowClick = (newActiveRecord) => history.push(`/browse/${schema}/${table}/edit/${newActiveRecord[hashAttribute]}`);

  return (
    <>
      <Row>
        <Col>
          <span className="text-bold text-white mb-2">{schema} {table && '>'} {table}&nbsp;</span>
        </Col>
        <Col className="text-right">
          <i className="fa fa-refresh text-white mr-2" onClick={handleRefreshClick} />
          <i className="fa fa-search text-white mr-2" onClick={handleFilterClick} />
          <i className="fa fa-plus text-white" onClick={handleNewRecordClick} />
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
            getTdProps={(state, rowInfo) => ({ onClick: () => handleRowClick(rowInfo.original) })}
          />
        </CardBody>
      </Card>
    </>
  );
};
