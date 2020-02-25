import React, { useState } from 'react';
import { Row, Col } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';

import EntityManager from '../../shared/entityManager';
import useLMS from '../../../stores/lmsData';
import DataTable from './datatable';
import buildInstanceStructure from '../../../util/buildInstanceStructure';
import handleSchemaTableRedirect from '../../../util/handleSchemaTableRedirect';
import defaultLMSData from '../../../util/state/defaultLMSData';

export default ({ auth, network, refreshInstance, structure }) => {
  const history = useHistory();
  const [lmsData] = useLMS(defaultLMSData);
  const { instance_id, schema, table } = useParams();
  const [entities, setEntities] = useState({ schemas: [], tables: [] });

  useAsyncEffect(() => {
    handleSchemaTableRedirect({ entities, instance_id, schema, table, history, targetPath: '/clustering' });
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
          baseUrl={`/instances/${instance_id}/clustering`}
          itemType="schema"
        />
        { schema && (
          <EntityManager
            activeItem={table}
            items={entities.tables}
            activeSchema={schema}
            baseUrl={`/instances/${instance_id}/clustering/${schema}`}
            itemType="table"
            auth={auth}
            refreshInstance={refreshInstance}
          />
        )}
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <DataTable
          instances={lmsData.instances.filter((i) => i.id !== instance_id)}
          network={network}
          schema={schema}
          table={table}
          auth={auth}
          instance_id={instance_id}
          refreshInstance={refreshInstance}
        />
      </Col>
    </Row>
  );
};
