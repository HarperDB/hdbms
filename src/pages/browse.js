import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, CardBody, Card } from '@nio/ui-kit';
import { withRouter } from 'react-router-dom';

import { HarperDBContext } from '../providers/harperdb';
import DataTable from '../components/browse/datatable';
import EntityManager from '../components/browse/entityManager';
import JSONViewer from '../components/browse/jsonviewer';

export default withRouter(({ history, match: { params: { schema, table, hash, action } } }) => {
  const { db, connection, refreshDB } = useContext(HarperDBContext);

  const [showFilter, toggleShowFilter] = useState(false);
  const [filtered, onFilteredChange] = useState([]);
  const [pageSize, onPageSizeChange] = useState(20);
  const [page, onPageChange] = useState(0);

  const schemas = Object.keys(db);
  const tables = schema && db[schema] && Object.keys(db[schema]);
  const noSchemas = !db || !schemas.length;
  const noTables = !db || (tables && !tables.length);

  const toggleFilter = (newValue = false) => {
    if (!newValue) onFilteredChange([]);
    toggleShowFilter(newValue);
  };

  useEffect(() => {
    toggleShowFilter(false);
    onFilteredChange([]);
  }, [schema, table]);

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <EntityManager
          activeItem={schema}
          items={schemas}
          connection={connection}
          refreshDB={refreshDB}
          toggleFilter={toggleFilter}
          itemType="schema"
        />
        { tables && (
          <EntityManager
            activeItem={table}
            items={tables}
            connection={connection}
            refreshDB={refreshDB}
            toggleFilter={toggleFilter}
            activeSchema={schema}
            itemType="table"
          />
        )}
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <Row>
          <Col>
            <span className="text-bold text-white mb-2">{schema} {table && '>'} {table} {action === 'add' ? '> add new' : hash ? `> ${hash}` : ''}</span>
          </Col>
          { !action && table && (
            <Col className="text-right">
              <i className="fa fa-refresh text-white mr-2" onClick={() => refreshDB(new Date())} />
              <i className="fa fa-search text-white mr-2" onClick={() => toggleFilter(!showFilter)} />
              <i className="fa fa-plus text-white" onClick={() => history.push(`/browse/${schema}/${table}/add`)} />
            </Col>
          )}
        </Row>
        <Card className="mb-3 mt-2">
          <CardBody>
            { action ? (
              <JSONViewer
                activeSchema={schema}
                activeTable={table}
                activeHash={hash}
                hashAttribute={db[schema][table].hash_attribute}
                columns={db[schema][table].columns_object}
                action={action}
              />
            ) : table ? (
              <DataTable
                activeSchema={schema}
                activeTable={table}
                activeHash={hash}
                hashAction={action}
                showFiltering={showFilter}
                onFilteredChange={onFilteredChange}
                filtered={filtered}
                pageSize={pageSize}
                onPageSizeChange={onPageSizeChange}
                page={page}
                onPageChange={onPageChange}
                noSchemas={noSchemas}
                noTables={noTables}
              />
            ) : (
              <div className="text-center">Please {(schema && noTables) || noSchemas ? 'create' : 'choose'} a {schema ? 'table' : 'schema'}</div>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
});
