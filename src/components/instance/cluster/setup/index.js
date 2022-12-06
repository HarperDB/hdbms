import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import Role from './Role';
import User from './User';
import Port from './Port';
import Enable from './Enable';
import NodeName from './NodeName';
import EmptyPrompt from '../../../shared/EmptyPrompt';
import ErrorFallback from '../../../shared/ErrorFallback';
import addError from '../../../../functions/api/lms/addError';

function SetupIndex({ setConfiguring, clusterStatus, refreshStatus }) {
  const { compute_stack_id } = useParams();
  const [nodeName, setNodeName] = useState(false);

  return (
    <Row id="clustering">
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="floating-card-header">enable clustering</span>
        <Card className="my-3">
          <CardBody>
            <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
              <Role clusterRole={clusterStatus?.cluster_role} refreshStatus={refreshStatus} />
              {clusterStatus?.cluster_role && <User clusterUser={clusterStatus.cluster_user} clusterRole={clusterStatus.cluster_role} refreshStatus={refreshStatus} />}
              {clusterStatus?.cluster_user && <Port port={12345} />}
              {clusterStatus?.cluster_role && clusterStatus?.cluster_user && (
                <NodeName refreshStatus={refreshStatus} nodeNameSet={clusterStatus?.node_name_set || nodeName} setNodeName={setNodeName} />
              )}
              {clusterStatus?.cluster_role && clusterStatus?.cluster_user && clusterStatus?.node_name_set && <Enable setConfiguring={setConfiguring} />}
            </ErrorBoundary>
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        {clusterStatus?.cluster_role && clusterStatus?.cluster_user && clusterStatus?.node_name_set ? (
          <EmptyPrompt
            headline="You're all set!"
            description="Click the button at left to enable clustering. NOTE: We'll restart the instance when you click this button."
            icon={<i className="fa fa-thumbs-up text-success" />}
          />
        ) : clusterStatus?.cluster_role && clusterStatus?.cluster_user ? (
          <EmptyPrompt
            headline="Set Instance Cluster Name"
            description={`We need to set a unique node name to identify your instance in the cluster. By default, we set it to "${compute_stack_id}", but you can choose your own unique node name.`}
            icon={<i className="fa fa-exclamation-triangle text-warning" />}
          />
        ) : clusterStatus?.cluster_user ? (
          <EmptyPrompt
            headline="Cluster Port Set To: 12345"
            description="If your instance is behind a firewall, you'll need to ensure this port is accessible by other instances if you want to publish/subscribe to/from this instance."
            icon={<i className="fa fa-thumbs-up text-success" />}
          />
        ) : clusterStatus?.cluster_role ? (
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
