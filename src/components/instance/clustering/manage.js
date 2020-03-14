import React, { useState } from 'react';
import { Row, Col } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import EntityManager from '../../shared/entityManager';
import DataTable from './datatable';
import buildInstanceStructure from '../../../util/buildInstanceStructure';
import handleSchemaTableRedirect from '../../../util/handleSchemaTableRedirect';
import appState from '../../../state/stores/appState';
import instanceState from '../../../state/stores/instanceState';

export default () => {
  const history = useHistory();
  const { compute_stack_id, schema, table } = useParams();
  const [entities, setEntities] = useState({ schemas: [], tables: [] });
  const instances = useStoreState(appState, (s) => s.instances);
  const { auth, url, network, structure } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    network: s.network,
    structure: s.structure,
  }));

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
          />
        )}
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        <DataTable
          instances={instances.filter((i) => i.compute_stack_id !== compute_stack_id)}
          network={network}
          schema={schema}
          table={table}
          auth={auth}
          url={url}
          compute_stack_id={compute_stack_id}
        />
      </Col>
    </Row>
  );
};
