import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Input, Row } from '@nio/ui-kit';
import { useAlert } from 'react-alert';
import useAsyncEffect from 'use-async-effect';

import defaultFormData from '../../util/defaultFormData';
import useLMS from '../../stores/lmsData';
import defaultLMSData from '../../util/defaultLMSData';
import queryLMS from '../../util/queryLMS';

export default () => {
  const [showForm, setShowForm] = useState(false);
  const [lmsData] = useLMS(defaultLMSData);
  const alert = useAlert();
  const [formData, updateForm] = useState(defaultFormData);

  useAsyncEffect(async () => {
    if (formData.submitted) {
      const newInstance = await queryLMS({
        endpoint: 'addInstance',
        method: 'POST',
        payload: formData,
        auth: lmsData.auth,
      });
      if (newInstance.error) {
        alert.error(newInstance.error);
        updateForm({ ...formData, error: newInstance.error, submitted: false });
      } else {
        updateForm(defaultFormData);
      }
    }
  }, [formData]);

  return (
    <Col xs="12" md={showForm ? 12 : 6} lg={showForm ? 12 : 4} xl={showForm ? 12 : 3} className="mb-4">
      {showForm ? (
        <Card className={`instance ${formData.error ? 'error' : ''}`}>
          <CardBody>
            <Input
              onChange={(e) => updateForm({ ...formData, user: e.target.value, error: false })}
              className="text-center mb-2"
              type="text"
              title="username"
              placeholder="user"
              bsSize="sm"
            />
            <Input
              onChange={(e) => updateForm({ ...formData, pass: e.target.value, error: false })}
              className="text-center mb-2"
              type="password"
              title="password"
              placeholder="pass"
              bsSize="sm"
            />
            <Row noGutters>
              <Col xs="6" className="pr-1">
                <Button
                  onClick={() => { updateForm(defaultFormData); setShowForm(false); }}
                  title="Cancel"
                  block
                  color="grey"
                >
                  Cancel
                </Button>
              </Col>
              <Col xs="6" className="pl-1">
                <Button
                  onClick={() => updateForm({ ...formData, submitted: true, error: false })}
                  title="Add Instance"
                  block
                  color="purple"
                >
                  Add Instance
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      ) : (
        <Card title="Add New Instance" className="instance" onClick={() => setShowForm(true)}>
          <CardBody className="text-center pt-5">
            <i className="text-purple fa fa-2x fa-plus mt-2" />
          </CardBody>
        </Card>
      )}
    </Col>
  );
};
