import React from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';

const CodeEditor = ({ refreshApi }) => (
  <>
    <Row className="floating-card-header">
      <Col>manage clustering</Col>
      <Col className="text-right">
        <Button color="link" onClick={refreshApi} className="mr-2">
          <span className="mr-2">refresh endpoints</span>
          <i title="Refresh Roles" className="fa fa-refresh" />
        </Button>
      </Col>
    </Row>
    <Card className="my-3">
      <CardBody className="react-table-holder">Code Editor</CardBody>
    </Card>
  </>
);

export default CodeEditor;
