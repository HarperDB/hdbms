import React from 'react';
import { Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useAlert } from 'react-alert';

export default ({ id, name }) => {
  const alert = useAlert();

  return (
    <Col xs="12" md="6" lg="4" xl="3" className="mb-4">
      <Card>
        <CardBody>
          {name}
          <hr />
          <Row>
            <Col xs="6" className="pr-1">
              <Button onClick={() => alert.success(`toggle pub for ${id}`)} block color="purple" className="px-2">Pub</Button>
            </Col>
            <Col xs="6" className="pl-1">
              <Button onClick={() => alert.success(`toggle sub for ${id}`)} block color="purple" className="px-2">Sub</Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};
