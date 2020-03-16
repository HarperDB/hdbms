import React from 'react';
import { useHistory } from 'react-router';
import { Card, CardBody, Col } from '@nio/ui-kit';

export default () => {
  const history = useHistory();

  return (
    <Col xs="12" md="6" lg="4" xl="3" className="mb-4">
      <Card title="Add New Instance" className="instance" onClick={() => history.push('/instances/new/type')}>
        <CardBody className="d-flex flex-column align-items-center justify-content-center">
          <i className="text-purple fa fa-2x fa-plus" />
        </CardBody>
      </Card>
    </Col>
  );
};
