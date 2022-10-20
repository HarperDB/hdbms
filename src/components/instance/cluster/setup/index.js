import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../../functions/state/instanceState';

import Role from './Role';
import User from './User';
import Port from './Port';
import Enable from './Enable';
import NodeName from './NodeName';
import EmptyPrompt from '../../../shared/EmptyPrompt';

import configureCluster from '../../../../functions/api/instance/configureCluster';
import restartInstance from '../../../../functions/api/instance/restartInstance';
import ErrorFallback from '../../../shared/ErrorFallback';
import addError from '../../../../functions/api/lms/addError';
import setConfiguration from '../../../../functions/api/instance/setConfiguration';

function SetupIndex({ setConfiguring }) {
  const { customer_id, compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth, [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url, [compute_stack_id]);
  const is_local = useStoreState(instanceState, (s) => s.is_local, [compute_stack_id]);
  const cluster_role = useStoreState(instanceState, (s) => s.network?.cluster_role, [compute_stack_id]);
  const cluster_user = useStoreState(instanceState, (s) => s.network?.cluster_user, [compute_stack_id]);
  const name = useStoreState(instanceState, (s) => s.network?.name, [compute_stack_id]);
  const [nodeNameMatch, setNodeNameMatch] = useState(compute_stack_id === name);
  const [formState, setFormState] = useState({});

  useAsyncEffect(async () => {
    if (formState.submitted) {
      if (parseFloat(auth.version) >= 4) {
        await setConfiguration({
          auth,
          url,
          clustering_nodeName: compute_stack_id,
          clustering_enabled: true,
          clustering_user: cluster_user,
          clustering_hubServer_cluster_network_port: 12345,
        });
      } else {
        await configureCluster({
          compute_stack_id,
          cluster_user,
          port: 12345,
          auth,
          url,
          is_local,
          customer_id,
        });
      }
      if (window._kmq) window._kmq.push(['record', 'enabled clustering']);
      restartInstance({ auth, url });
      setTimeout(() => setConfiguring(true), 0);
    }
  }, [formState.submitted]);

  return (
    <Row id="clustering">
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="floating-card-header">enable clustering</span>
        <Card className="my-3">
          <CardBody>
            <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
              <Role />
              {cluster_role && <User />}
              {cluster_user && <Port port={12345} />}
              {cluster_role && cluster_user && <NodeName nodeNameMatch={nodeNameMatch} setNodeNameMatch={setNodeNameMatch} />}
              {cluster_role && cluster_user && nodeNameMatch && <Enable setFormState={setFormState} />}
            </ErrorBoundary>
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        {cluster_role && cluster_user && nodeNameMatch ? (
          <EmptyPrompt
            headline="You're all set!"
            description="Click the button at left to enable clustering. NOTE: We'll restart the instance when you click this button."
            icon={<i className="fa fa-thumbs-up text-success" />}
          />
        ) : cluster_role && cluster_user ? (
          <EmptyPrompt
            headline="Set Instance Cluster Name"
            description={`We need to set your instance's cluster_name to match your instance_id, which is "${compute_stack_id}". Clustering needs each instance to have a unique name.`}
            icon={<i className="fa fa-exclamation-triangle text-warning" />}
          />
        ) : cluster_user ? (
          <EmptyPrompt
            headline="Cluster Port Set To: 12345"
            description="If your instance is behind a firewall, you'll need to ensure this port is accessible by other instances if you want to publish/subscribe to/from this instance."
            icon={<i className="fa fa-thumbs-up text-success" />}
          />
        ) : cluster_role ? (
          <EmptyPrompt
            headline="Create a Cluster User"
            description="If you have other instances you want to cluster together with this one, make sure the cluster user has the same name and password as those other instances."
            icon={<i className="fa fa-exclamation-triangle text-warning" />}
          />
        ) : (
          <EmptyPrompt
            headline="Create a Cluster Role"
            description="This role subscribes to instance transaction logs and handles operations that result from its pub/sub configuration."
            icon={<i className="fa fa-exclamation-triangle text-warning" />}
          />
        )}
      </Col>
    </Row>
  );
}

export default SetupIndex;
