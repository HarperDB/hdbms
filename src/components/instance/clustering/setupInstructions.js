import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

const SetupInstructions = ({ showNodeNameInstructions }) => (
  <Card className="my-3">
    <CardBody>
      This instance does not yet have clustering enabled. To enable clustering, complete the steps at left.
      <hr />
      <Row className="notification-holder">
        <Col>
          <Card className="cluster-notifications">
            <CardBody>
              <b>Matching Cluster User Name and Password</b>
              <br />
              <br />
              If you have other instances you want to cluster together with this one, make sure the cluster user has the same name and password as those other instances.
            </CardBody>
          </Card>
        </Col>
        {showNodeNameInstructions && (
          <Col>
            <Card className="cluster-notifications">
              <CardBody>
                <b>&quot;Cluster Node Name&quot; needs to be updated</b>
                <br />
                <br />
                We need to generate and set this value in your config file. If this instance is already clustered with other instances, you will want to restore your pub/sub
                settings after completing this process.
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
    </CardBody>
  </Card>
);

export default SetupInstructions;
