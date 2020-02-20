import React, { useState } from 'react';
import { Row, Col } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';

import EntityManager from '../shared/entityManager';
import useLMS from '../../stores/lmsData';
import ClusterCard from './clusterCard';
import DataTable from './datatable';
import useInstanceAuth from '../../stores/instanceAuths';
import setStructureEntities from '../../util/setStructureEntities';
import handleSchemaTableRedirect from '../../util/handleSchemaTableRedirect';
import defaultTableState from '../../util/defaultTableState';

export default ({ auth, network, refreshInstance, structure }) => {
  const history = useHistory();
  const [lmsData] = useLMS({ auth: false, instances: [] });
  const { instance_id, schema, table } = useParams();
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const [entities, setEntities] = useState({ schemas: [], tables: [] });
  const [tableState, setTableState] = useState(defaultTableState);

  useAsyncEffect(() => {
    handleSchemaTableRedirect({ entities, instance_id, schema, table, history, targetPath: '/clustering' });
  }, [schema, table, entities]);

  useAsyncEffect(() => {
    if (structure) setEntities(setStructureEntities({ structure, schema, table }));
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
        {/*
        <div className="text-white mb-3">
          {schema} &gt; {table}
        </div>
        <Row>
          {lmsData.instances.filter((i) => i.id !== instance_id).map((i) => (
            <ClusterCard
              key={i.id}
              {...i}
              connection={network && network.outbound_connections.find((n) => n.name === i.id)}
              clusterPort={12345}
              schema={schema}
              table={table}
              refreshInstance={refreshInstance}
              auth={auth}
              instanceAuth={instanceAuths[i.id]}
              setAuth={({ id, user, pass }) => setInstanceAuths({ ...instanceAuths, [id]: { user, pass } })}
            />
          ))}
        </Row>

        <div className="code-holder">
          <Code>
            {stringify(network.outbound_connections, { maxLength: 20 })}
          </Code>
        </div>
        */}
      </Col>
    </Row>
  );
};
