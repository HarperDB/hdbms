import React from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { Card, CardBody, Col } from '@nio/ui-kit';

import NewInstanceModal from '../new';

export default () => {
  const { action } = useParams();
  const history = useHistory();

  return (
    <>
      <Col xs="12" md="6" lg="4" xl="3" className="mb-4">
        <Card title="Add New Instance" className="instance" onClick={() => history.push('/instances/new/type')}>
          <CardBody className="text-center pt-5">
            <i className="text-purple fa fa-2x fa-plus mt-2" />
          </CardBody>
        </Card>
      </Col>
      {action === 'new' && (<NewInstanceModal />)}
    </>
  );
};
