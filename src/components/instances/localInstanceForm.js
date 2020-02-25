import React, { useState } from 'react';
import { Col, Input, Row, RadioCheckbox, Button, Card, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import defaultInstanceFormData from '../../util/state/defaultInstanceFormData';

export default ({ products, setInstanceDetails, needsCard }) => {
  const [formData, updateForm] = useState(defaultInstanceFormData);

  useAsyncEffect(async () => {
    if (formData.submitted) {
      formData.is_local = true;
      setInstanceDetails(formData);
    }
  }, [formData]);

  useAsyncEffect(() => {
    if (products) {
      updateForm({ ...formData, stripe_product_id: products[0].value });
    }
  }, [products]);

  return (
    <>
      <Card>
        <CardBody>
          <div className="new-instance-label">Instance Name</div>
          <div className="fieldset">
            <Input
              onChange={(e) => updateForm({ ...formData, instance_name: e.target.value, error: false })}
              type="text"
              title="instance_name"
              value={formData.instance_name}
            />
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
                  type="text"
                  title="username"
                  value={formData.user}
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
                  type="password"
                  title="password"
                  value={formData.pass}
                />
              </Col>
            </Row>
          </div>

          <div className="new-instance-label">Instance Type</div>
          <div className="fieldset">
            <RadioCheckbox
              className="radio-button"
              type="radio"
              onChange={(value) => updateForm({ ...formData, stripe_product_id: value })}
              options={products}
              value={formData.stripe_product_id || ''}
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
                  type="text"
                  title="host"
                  value={formData.host || ''}
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
                  type="number"
                  title="port"
                  value={formData.port || ''}
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
                  value={formData.is_ssl}
                />
              </Col>
            </Row>
          </div>

        </CardBody>
      </Card>
      <Button
        onClick={() => updateForm({ ...formData, submitted: true, error: false })}
        title={needsCard ? 'Add Payment Method' : 'Confirm Instance Details'}
        block
        className="mt-3"
        color="purple"
      >
        Next Step: {needsCard ? 'Add Payment Method' : 'Confirm Instance Details'}
      </Button>
    </>
  );
};
