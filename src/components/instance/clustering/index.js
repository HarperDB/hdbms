import React, { useEffect } from 'react';
import { Code, Row, Col, Card, CardBody, Button } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import stringify from 'json-stringify-pretty-compact';
import { useAlert } from 'react-alert';

import EntityManager from '../shared/entityManager';
import useLMS from '../../../stores/lmsData';
import ClusterCard from './clusterCard';

export default ({ auth, structure, network, refreshInstance }) => {
  const history = useHistory();
  const [lmsData] = useLMS({ auth: false, instances: [] });
  const { instance_id, schema, table } = useParams();

  const schemas = structure && Object.keys(structure);
  const tables = structure && schemas && structure[schema] && Object.keys(structure[schema]);

  useEffect(() => {
    switch (true) {
      case (!schemas && history.location.pathname !== '/clustering'):
        history.push(`/instances/${instance_id}/clustering`);
        break;
      case (schemas && schemas.length && !schema):
      case (schemas && schemas.length && schema && !schemas.includes(schema)):
        history.push(`/instances/${instance_id}/clustering/${schemas[0]}`);
        break;
      case (tables && tables.length && !table):
      case (tables && tables.length && table && !tables.includes(table)):
        history.push(`/instances/${instance_id}/clustering/${schema}/${tables[0]}`);
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
          baseUrl={`/instances/${instance_id}/clustering`}
          itemType="schema"
        />
        { schema && (
          <EntityManager
            activeItem={table}
            items={tables}
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
          {lmsData.instances.filter((i) => i.id !== instance_id).map((i) => (
            <ClusterCard key={i.id} {...i} />
          ))}
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
