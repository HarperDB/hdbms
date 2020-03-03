import React, { useState } from 'react';
import { Row, Col, CardBody, Card } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import DataTable from './datatable';
import EntityManager from '../../shared/entityManager';
import JSONViewer from './jsonviewer';
import CSVUploader from './csvuploader';
import buildInstanceStructure from '../../../util/buildInstanceStructure';
import handleSchemaTableRedirect from '../../../util/handleSchemaTableRedirect';

export default ({ auth, structure, refreshInstance }) => {
  const history = useHistory();
  const { instance_id, schema, table, action } = useParams();
  const [entities, setEntities] = useState({ schemas: [], tables: [], activeTable: false });

  useAsyncEffect(() => {
    handleSchemaTableRedirect({ entities, instance_id, schema, table, history, targetPath: '/browse' });
  }, [schema, table, entities]);

  useAsyncEffect(() => {
    if (structure) setEntities(buildInstanceStructure({ structure, schema, table }));
  }, [structure, schema, table]);

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <EntityManager
          activeItem={schema}
          items={entities.schemas}
          auth={auth}
          refreshInstance={refreshInstance}
          baseUrl={`/instances/${instance_id}/browse`}
          itemType="schema"
          showForm
        />
        { schema && (
          <EntityManager
            activeItem={table}
            items={entities.tables}
            activeSchema={schema}
            baseUrl={`/instances/${instance_id}/browse/${schema}`}
            itemType="table"
            auth={auth}
            refreshInstance={refreshInstance}
            showForm
          />
        )}
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        { schema && table && action === 'csv' && entities.activeTable ? (
          <CSVUploader
            auth={auth}
            instance_id={instance_id}
            refreshInstance={refreshInstance}
          />
        ) : schema && table && action && entities.activeTable ? (
          <JSONViewer
            newEntityColumns={entities.activeTable.newEntityColumns}
            hashAttribute={entities.activeTable.hashAttribute}
            auth={auth}
            instance_id={instance_id}
            refreshInstance={refreshInstance}
          />
        ) : schema && table && entities.activeTable ? (
          <DataTable
            activeTable={entities.activeTable}
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
                <div className="text-center">Please {(schema && entities.tables && !entities.tables.length) || !entities.schemas.length ? 'create' : 'choose'} a {schema ? 'table' : 'schema'}</div>
              </CardBody>
            </Card>
          </>
        )}
      </Col>
    </Row>
  );
};
