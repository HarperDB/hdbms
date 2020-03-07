import React, { useState } from 'react';
import { Row, Col } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';

import EntityManager from '../../shared/entityManager';
import DataTable from './datatable';
import buildInstanceStructure from '../../../util/buildInstanceStructure';
import handleSchemaTableRedirect from '../../../util/handleSchemaTableRedirect';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';

export default ({ auth, network, refreshInstance, structure }) => {
  const history = useHistory();
  const [appData] = useApp(defaultAppData);
  const { compute_stack_id, schema, table } = useParams();
  const [entities, setEntities] = useState({ schemas: [], tables: [] });

  useAsyncEffect(() => {
    handleSchemaTableRedirect({ entities, compute_stack_id, schema, table, history, targetPath: '/clustering' });
  }, [schema, table, entities]);

  useAsyncEffect(() => {
    if (structure) setEntities(buildInstanceStructure({ structure, schema, table }));
  }, [structure, schema, table]);

  return (
    <Row id="clustering">
      <Col xl="3" lg="4" md="5" xs="12">
        <EntityManager
          activeItem={schema}
          items={entities.schemas}
          auth={auth}
          refreshInstance={refreshInstance}
          baseUrl={`/instance/${compute_stack_id}/clustering`}
          itemType="schema"
        />
        { schema && (
          <EntityManager
            activeItem={table}
            items={entities.tables}
            activeSchema={schema}
            baseUrl={`/instance/${compute_stack_id}/clustering/${schema}`}
            itemType="table"
            auth={auth}
            refreshInstance={refreshInstance}
          />
        )}
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        <DataTable
          instances={appData.instances.filter((i) => i.compute_stack_id !== compute_stack_id)}
          network={network}
          schema={schema}
          table={table}
          auth={auth}
          compute_stack_id={compute_stack_id}
          refreshInstance={refreshInstance}
        />
      </Col>
    </Row>
  );
};
