import React from 'react';
import { Row, Col, Button } from 'reactstrap';

const NodeName = ({ nodeNameMatch, setNodeNameMatch }) =>
  nodeNameMatch ? (
    <Row>
      <Col xs="12">
        <hr className="my-3" />
      </Col>
      <Col xs="10" className="text">
        Cluster Node Name
      </Col>
      <Col xs="2" className="text text-end">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <>
      <hr className="my-3" />
      <Button color="success" block onClick={() => setNodeNameMatch(true)}>
        Set Cluster Node Name
      </Button>
    </>
  );

export default NodeName;
