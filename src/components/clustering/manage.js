import React, { useState } from 'react';
import { Code, Row, Col } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';
import stringify from 'json-stringify-pretty-compact';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';

import EntityManager from '../shared/entityManager';
import useLMS from '../../stores/lmsData';
import ClusterCard from './manage_clusterCard';
import useInstanceAuth from '../../stores/instanceAuths';

export default ({ auth, network, refreshInstance, structure }) => {
  const history = useHistory();
  const [lmsData] = useLMS({ auth: false, instances: [] });
  const { instance_id, schema, table } = useParams();
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const [entities, setEntities] = useState({ schemas: [], tables: [] });

  useAsyncEffect(() => {
    if (structure) {
      const newSchemas = structure && Object.keys(structure);
      const newTables = structure && newSchemas && structure[schema] && Object.keys(structure[schema]);
      setEntities({ schemas: newSchemas, tables: newTables });
    }
  }, [structure, schema]);

  useAsyncEffect(() => {
    switch (true) {
      case (!entities.schemas && history.location.pathname !== '/clustering'):
        history.push(`/instances/${instance_id}/clustering`);
        break;
      case (entities.schemas && entities.schemas.length && !schema):
      case (entities.schemas && entities.schemas.length && schema && !entities.schemas.includes(schema)):
        history.push(`/instances/${instance_id}/clustering/${entities.schemas[0]}`);
        break;
      case (entities.tables && entities.tables.length && !table):
      case (entities.tables && entities.tables.length && table && !entities.tables.includes(table)):
        history.push(`/instances/${instance_id}/clustering/${schema}/${entities.tables[0]}`);
        break;
      default:
        break;
    }
  }, [schema, entities, table]);

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
        <div className="text-white mb-3">
          {schema} &gt; {table} &gt; data replication
        </div>
        <Row>
          {lmsData.instances.filter((i) => i.id !== instance_id).map((i) => {
            const connection = network && network.outbound_connections.find((n) => n.node_name === i.node_name);
            const pub = schema && table && connection && connection.subscriptions && connection.subscriptions.find((s) => s.channel === `${schema}:${table}` && s.publish);
            const sub = schema && table && connection && connection.subscriptions && connection.subscriptions.find((s) => s.channel === `${schema}:${table}` && s.subscribe);
            return (
              <ClusterCard
                key={i.id}
                {...i}
                connection={connection}
                pub={pub}
                sub={sub}
                refreshInstance={refreshInstance}
                auth={auth}
                hasAuth={instanceAuths[i.id] && instanceAuths[i.id].user && instanceAuths[i.id].pass}
                setAuth={({ id, user, pass }) => setInstanceAuths({ ...instanceAuths, [id]: { user, pass } })}
              />
            );
          })}
        </Row>
        <div className="code-holder">
          <Code>
            {stringify(network.outbound_connections, { maxLength: 20 })}
          </Code>
        </div>
      </Col>
    </Row>
  );
};
