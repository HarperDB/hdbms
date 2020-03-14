import React, { useState } from 'react';
import { Row, Col, CardBody, Card } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import DataTable from './datatable';
import EntityManager from '../../shared/entityManager';
import JSONViewer from './jsonviewer';
import CSVUploader from './csvuploader';
import buildInstanceStructure from '../../../util/buildInstanceStructure';
import handleSchemaTableRedirect from '../../../util/handleSchemaTableRedirect';
import instanceState from '../../../state/stores/instanceState';

export default () => {
  const history = useHistory();
  const { schema, table, action } = useParams();
  const [entities, setEntities] = useState({ schemas: [], tables: [], activeTable: false });
  const { compute_stack_id, structure } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    structure: s.structure,
  }));

  useAsyncEffect(() => {
    handleSchemaTableRedirect({ entities, compute_stack_id, schema, table, history, targetPath: '/browse' });
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
          baseUrl={`/instance/${compute_stack_id}/browse`}
          itemType="schema"
          showForm
        />
        { schema && (
          <EntityManager
            activeItem={table}
            items={entities.tables}
            activeSchema={schema}
            baseUrl={`/instance/${compute_stack_id}/browse/${schema}`}
            itemType="table"
            showForm
          />
        )}
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        { schema && table && action === 'csv' && entities.activeTable ? (
          <CSVUploader />
        ) : schema && table && action && entities.activeTable ? (
          <JSONViewer newEntityColumns={entities.activeTable.newEntityColumns} hashAttribute={entities.activeTable.hashAttribute} />
        ) : schema && table && entities.activeTable ? (
          <DataTable activeTable={entities.activeTable} />
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
