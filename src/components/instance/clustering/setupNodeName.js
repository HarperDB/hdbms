import React from 'react';
import { Row, Col, Button } from '@nio/ui-kit';

export default ({ nodeNameMatch, setNodeNameMatch }) =>
  nodeNameMatch ? (
    <Row>
      <Col xs="12">
        <hr />
      </Col>
      <Col xs="10" className="text">
        Cluster Node Name
      </Col>
      <Col xs="2" className="text text-right">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <>
      <hr />
      <Button color="success" block onClick={() => setNodeNameMatch(true)}>
        Set Cluster Node Name
      </Button>
    </>
  );
