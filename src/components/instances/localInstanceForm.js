import React, { useState } from 'react';
import { Col, Input, Row, RadioCheckbox, Button } from '@nio/ui-kit';
import { useAlert } from 'react-alert';
import useAsyncEffect from 'use-async-effect';

import defaultInstanceFormData from '../../util/defaultInstanceFormData';
import useLMS from '../../stores/lmsData';
import defaultLMSData from '../../util/defaultLMSData';
import queryLMS from '../../util/queryLMS';

export default ({ instanceType, products, setShowForm }) => {
  const [lmsData] = useLMS(defaultLMSData);
  const alert = useAlert();
  const [formData, updateForm] = useState(defaultInstanceFormData);

  useAsyncEffect(async () => {
    if (formData.submitted) {
      formData.is_local = instanceType === 'local';

      console.log(formData);
      return false;

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
        updateForm(defaultInstanceFormData);
      }
    }
  }, [formData]);

  return (
    <div className="pt-2">
      <div className="new-instance-label">Instance Type</div>
      <div className="fieldset">
        <RadioCheckbox
          className="radio-button"
          type="radio"
          onChange={(value) => console.log(value)}
          options={products}
          defaultValue={products[0]}
        />
      </div>

      <div className="new-instance-label">Instance Details</div>
      <div className="fieldset">
        <Row>
          <Col xs="4" className="pt-2">
            Host
          </Col>
          <Col xs="8">
            <Input
              onChange={(e) => updateForm({ ...formData, host: e.target.value, error: false })}
              className="text-center"
              type="text"
              title="host"
            />
          </Col>
        </Row>
        <hr className="my-1" />
        <Row>
          <Col xs="4" className="pt-2">
            Port
          </Col>
          <Col xs="8">
            <Input
              onChange={(e) => updateForm({ ...formData, port: e.target.value, error: false })}
              className="text-center"
              type="number"
              title="port"
            />
          </Col>
        </Row>
        <hr className="my-1" />
        <Row className="mt-1">
          <Col xs="4" className="pt-2">
            SSL
          </Col>
          <Col xs="8" className="pt-1">
            <RadioCheckbox
              type="checkbox"
              onChange={(value) => updateForm({ ...formData, is_ssl: value || false, error: false })}
              options={{ label: '', value: true }}
            />
          </Col>
        </Row>
      </div>

      <div className="new-instance-label">Admin Credentials</div>
      <div className="fieldset">
        <Row>
          <Col xs="4" className="pt-2">
            Username
          </Col>
          <Col xs="8">
            <Input
              onChange={(e) => updateForm({ ...formData, user: e.target.value, error: false })}
              className="text-center"
              type="text"
              title="username"
            />
          </Col>
        </Row>
        <hr className="my-1" />
        <Row>
          <Col xs="4" className="pt-2">
            Password
          </Col>
          <Col xs="8">
            <Input
              onChange={(e) => updateForm({ ...formData, pass: e.target.value, error: false })}
              className="text-center"
              type="password"
              title="password"
            />
          </Col>
        </Row>
      </div>
      <hr />
      <Row>
        <Col xs="6" className="pr-1">
          <Button
            onClick={() => { updateForm(defaultInstanceFormData); setShowForm(false); }}
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
    </div>
  );
};
