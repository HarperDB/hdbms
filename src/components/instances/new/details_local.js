import React, { useState } from 'react';
import { RadioCheckbox, Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';

export default ({ products, hasCard, newInstance, setNewInstance }) => {
  const history = useHistory();
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState({ stripe_plan_id: newInstance.stripe_plan_id || products[0].value });

  const computePrice = products && products.find((p) => p.value === formData.stripe_plan_id).price;
  const needsCard = products && !hasCard && computePrice && (computePrice !== 'FREE');

  useAsyncEffect(() => {
    const { submitted } = formState;
    const { stripe_plan_id } = formData;
    if (submitted) {
      if (stripe_plan_id) {
        setNewInstance({ ...newInstance, stripe_plan_id });
        history.push(needsCard ? '/instances/new/payment' : '/instances/new/confirm');
      } else {
        setFormState({ submitted: false, error: 'All fields must be filled out.' });
      }
    }
  }, [formState]);

  return (
    <>
      <Card>
        <CardBody>
          <div className="fieldset-label">Instance Type</div>
          <div className="fieldset full-height">
            <RadioCheckbox
              className="radio-button"
              type="radio"
              onChange={(value) => updateForm({ ...formData, stripe_plan_id: value })}
              options={products}
              value={formData.stripe_plan_id}
              defaultValue={newInstance.stripe_plan_id ? products.find((p) => p.value === newInstance.stripe_plan_id) : products[0]}
            />
          </div>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button
            onClick={() => history.push('/instances/new/meta_local')}
            title="Back to Basic Info"
            block
            className="mt-3"
            color="purple"
            outline
          >
            <i className="fa fa-chevron-circle-left mr-2" />Basic Info
          </Button>
        </Col>
        <Col sm="6">
          <Button
            onClick={() => setFormState({ submitted: true, error: false })}
            title={needsCard ? 'Add Payment Method' : 'Confirm Instance Details'}
            block
            className="mt-3"
            color="purple"
          >
            {needsCard ? 'Add Payment Method' : 'Confirm Instance Details'}<i className="fa fa-chevron-circle-right ml-2" />
          </Button>
        </Col>
      </Row>
      {formState.error && (
        <div className="text-danger text-small text-center">
          <hr />
          {formState.error}
        </div>
      )}
    </>
  );
};
