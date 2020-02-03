import React, { useEffect, useState } from 'react';
import { Row, Col, CardBody, Card } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import DataTable from './datatable';
import EntityManager from '../shared/entityManager';
import JSONViewer from './jsonviewer';
import CSVUploader from './csvuploader';

export default ({ auth, structure, refreshInstance }) => {
  const history = useHistory();
  const { instance_id, schema, table, action } = useParams();

  const [filtered, onFilteredChange] = useState([]);
  const [sorted, onSortedChange] = useState([]);
  const [page, onPageChange] = useState(0);

  const schemas = structure && Object.keys(structure);
  const tables = structure && schemas && structure[schema] && Object.keys(structure[schema]);
  const activeTable = structure && schemas && structure[schema] && tables && structure[schema][table] && structure[schema][table];

  useEffect(() => {
    if (activeTable) {
      onFilteredChange([]);
      onSortedChange([{ id: activeTable.hashAttribute, desc: false }]);
      onPageChange(0);
    }
  }, [activeTable]);

  useEffect(() => {
    switch (true) {
      case (!schemas && history.location.pathname !== '/browse'):
        history.push(`/instances/${instance_id}/browse`);
        break;
      case (schemas && schemas.length && !schema):
      case (schemas && schemas.length && schema && !schemas.includes(schema)):
        history.push(`/instances/${instance_id}/browse/${schemas[0]}`);
        break;
      case (tables && tables.length && !table):
      case (tables && tables.length && table && !tables.includes(table)):
        history.push(`/instances/${instance_id}/browse/${schema}/${tables[0]}`);
        break;
      default:
        break;
    }
  }, [schema, schemas, table, tables]);

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <EntityManager
          activeItem={schema}
          items={schemas}
          auth={auth}
          refreshInstance={refreshInstance}
          baseUrl={`/instances/${instance_id}/browse`}
          itemType="schema"
          showForm
        />
        { schema && (
          <EntityManager
            activeItem={table}
            items={tables}
            activeSchema={schema}
            baseUrl={`/instances/${instance_id}/browse/${schema}`}
            itemType="table"
            auth={auth}
            refreshInstance={refreshInstance}
            showForm
          />
        )}
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        { schema && table && action === 'csv' && activeTable ? (
          <CSVUploader
            auth={auth}
            instance_id={instance_id}
            refreshInstance={refreshInstance}
          />
        ) : schema && table && action && activeTable ? (
          <JSONViewer
            newEntityColumns={activeTable.newEntityColumns}
            hashAttribute={activeTable.hashAttribute}
            auth={auth}
            instance_id={instance_id}
            refreshInstance={refreshInstance}
          />
        ) : schema && table && activeTable ? (
          <DataTable
            dataTableColumns={activeTable.dataTableColumns}
            hashAttribute={activeTable.hashAttribute}
            onFilteredChange={onFilteredChange}
            filtered={filtered}
            onSortedChange={onSortedChange}
            sorted={sorted}
            onPageChange={onPageChange}
            page={page}
            auth={auth}
            instance_id={instance_id}
            refreshInstance={refreshInstance}
            structure={structure}
          />
        ) : (
          <>
            <span className="mb-2">&nbsp;</span>
            <Card className="mb-3 mt-2 py-5">
              <CardBody>
                <div className="text-center">Please {(schema && tables && !tables.length) || !schemas.length ? 'create' : 'choose'} a {schema ? 'table' : 'schema'}</div>
              </CardBody>
            </Card>
          </>
        )}
      </Col>
    </Row>
  );
};
