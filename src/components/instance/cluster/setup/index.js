import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import Role from './Role';
import User from './User';
import Port from './Port';
import Enable from './Enable';
import NodeName from './NodeName';
import EmptyPrompt from '../../../shared/EmptyPrompt';
import WarningTile from '../../../shared/WarningTile';
import ErrorFallback from '../../../shared/ErrorFallback';
import addError from '../../../../functions/api/lms/addError';

function SetupIndex({ setConfiguring, clusterStatus, refreshStatus }) {

  const { compute_stack_id } = useParams();
  const showUser = clusterStatus?.cluster_role;
  const showPort = clusterStatus?.cluster_role && clusterStatus?.cluster_user;
  const showName = clusterStatus?.cluster_role && clusterStatus?.cluster_user;
  const showEnable = clusterStatus?.cluster_role && clusterStatus?.cluster_user && clusterStatus?.node_name;

  return (
    <Row id="clustering">
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="floating-card-header">enable clustering</span>
        <Card className="my-3">
          <CardBody>
            <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
              <Role clusterStatus={clusterStatus} refreshStatus={refreshStatus} />
              {showUser && <User clusterStatus={clusterStatus} refreshStatus={refreshStatus} />}
              {showPort && <Port clusterStatus={clusterStatus} refreshStatus={refreshStatus} />}
              {showName && <NodeName clusterStatus={clusterStatus} refreshStatus={refreshStatus} />}
              {showEnable && <Enable setConfiguring={setConfiguring} clusterStatus={clusterStatus} />}
            </ErrorBoundary>
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        {showEnable ? (
          <EmptyPrompt
            headline="You're all set!"
            description="Click the button at left to enable clustering. NOTE: We'll restart the instance when you click this button."
            icon={<i className="fa fa-thumbs-up text-success" />}
          />
        ) : showName ? (
          <EmptyPrompt
            headline="Set Instance Cluster Name"
            description={`We need to set a unique node name to identify your instance in the cluster. By default, we set it to "${compute_stack_id}", but you can choose your own unique node name.`}
            icon={<i className="fa fa-exclamation-triangle text-warning" />}
          />
        ) : showPort ? (
          <EmptyPrompt
            headline="Cluster Port Set To: 12345"
            description="If your instance is behind a firewall, you'll need to ensure this port is accessible by other instances if you want to publish/subscribe to/from this instance."
            icon={<i className="fa fa-thumbs-up text-success" />}
          />
        ) : showUser ? (
          <EmptyPrompt
            headline="Create a Cluster User"
            description="If you have other instances you want to cluster together with this one, make sure the cluster user has the same name and password as those other instances."
            warning="HarperDB clustering functionality will not work between AWS cloud instances. We plan to fix this in an upcoming 4.x release."
            icon={<i className="fa fa-exclamation-triangle text-warning" />} >
            <div>warning: clustering wont work for aws cloud instances</div>
          </EmptyPrompt>
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
