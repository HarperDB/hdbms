import React, { useState } from 'react';
import { Card, CardBody, Col } from '@nio/ui-kit';

import NewInstanceModal from '../new';

export default () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Col xs="12" md="6" lg="4" xl="3" className="mb-4">
        <Card title="Add New Instance" className="instance" onClick={() => setShowForm(true)}>
          <CardBody className="text-center pt-5">
            <i className="text-purple fa fa-2x fa-plus mt-2" />
          </CardBody>
        </Card>
      </Col>
      {showForm && (<NewInstanceModal setShowForm={setShowForm} />)}
    </>
  );
};
