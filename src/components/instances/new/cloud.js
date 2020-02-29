import React, { useState } from 'react';
import { RadioCheckbox, Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

export default ({ products, storage, regions, hasCard, newInstance, setNewInstance, setPurchaseStep }) => {
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState({
    storage_qty_gb: newInstance.storage_qty_gb || storage[0].value,
    stripe_plan_id: newInstance.stripe_plan_id || products[0].value,
    instance_region: newInstance.instance_region || regions[0].value,
    stripe_product_id: 'prod_Gh1XXQx6J8YaJl',
    stripe_storage_product_id: 'prod_GoUJnVwOYvTjU9',
    stripe_storage_plan_id: 'plan_GoUmLEBX2KIiaF',
  });

  const computePrice = products && products.find((p) => p.value === formData.stripe_plan_id).price;
  const storagePrice = storage && storage.find((p) => p.value === formData.storage_qty_gb).price;
  const needsCard = products && storage && !hasCard && computePrice && (computePrice !== 'FREE' || storagePrice !== 'FREE');

  useAsyncEffect(() => {
    const { submitted } = formState;
    const { stripe_plan_id, instance_region, storage_qty_gb } = formData;
    if (submitted) {
      if (stripe_plan_id && instance_region && storage_qty_gb) {
        setNewInstance({ ...newInstance, ...formData });
        setPurchaseStep(needsCard ? 'payment' : 'confirm');
      } else {
        setFormState({ submitted: false, error: 'All fields must be filled out.' });
      }
    }
  }, [formState]);

  return (
    <>
      <Card>
        <CardBody>
          <div className="new-instance-label">Storage Size (scroll for more)</div>
          <div className="fieldset">
            <RadioCheckbox
              id="storage_qty_gb"
              className="radio-button"
              type="radio"
              onChange={(value) => updateForm({ ...formData, storage_qty_gb: value })}
              options={storage}
              value={formData.storage_qty_gb}
              defaultValue={newInstance.storage_qty_gb ? storage.find((p) => p.value === newInstance.storage_qty_gb) : storage[0]}
            />
          </div>

          <div className="new-instance-label">Instance RAM (scroll for more)</div>
          <div className="fieldset">
            <RadioCheckbox
              id="stripe_plan_id"
              className="radio-button"
              type="radio"
              onChange={(value) => updateForm({ ...formData, stripe_plan_id: value })}
              options={products}
              value={formData.stripe_plan_id}
              defaultValue={newInstance.stripe_plan_id ? products.find((p) => p.value === newInstance.stripe_plan_id) : products[0]}
            />
          </div>

          <div className="new-instance-label">Instance Region (scroll for more)</div>
          <div className="fieldset">
            <RadioCheckbox
              id="instance_region"
              className="radio-button"
              type="radio"
              onChange={(value) => updateForm({ ...formData, instance_region: value })}
              options={regions}
              value={formData.instance_region}
              defaultValue={newInstance.instance_region ? regions.find((p) => p.value === newInstance.instance_region) : regions[0]}
            />
          </div>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button
            onClick={() => setPurchaseStep('meta')}
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
        <div className="text-danger text-center">
          <hr />
          {formState.error}
        </div>
      )}
    </>
  );
};
