import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Input, RadioCheckbox, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';

import useLMS from '../../../state/stores/lmsAuth';
import updateInstance from '../../../api/lms/updateInstance';
import updateLicense from '../../../api/lms/updateLicense';
import setLicense from '../../../api/instance/setLicense';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';
import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';

export default ({ instanceAuth, details, refreshInstance, computeProducts, storageProducts }) => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [{ customer }] = useApp(defaultAppData);
  const history = useHistory();
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState({ instance_name: details.instance_name, stripe_plan_id: details.stripe_plan_id, data_volume_size: details.data_volume_size });
  const hasCard = customerHasChargeableCard(customer);

  let totalPrice = 0;
  const newComputePrice = computeProducts.find((p) => p.value === formData.stripe_plan_id);
  if (newComputePrice.price !== 'FREE') totalPrice += parseFloat(newComputePrice.price);

  if (storageProducts) {
    const newStoragePrice = storageProducts.find((p) => p.value === formData.data_volume_size);
    if (newStoragePrice.price !== 'FREE') totalPrice += parseFloat(newStoragePrice.price);
  }

  const hasChanged = details.stripe_plan_id !== formData.stripe_plan_id || details.data_volume_size !== formData.data_volume_size;

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { stripe_product_id, instance_name, compute_stack_id, customer_id, license_id, fingerprint, data_volume_size } = formData;

      const newLicense = await updateLicense({ auth: lmsAuth, payload: { license_id, stripe_product_id, compute_stack_id, customer_id, fingerprint } });
      await setLicense({ auth: instanceAuth, key: newLicense.key, company: newLicense.company });
      await updateInstance({ auth: lmsAuth, payload: { stripe_product_id, compute_stack_id, customer_id, instance_name, data_volume_size } });
      setFormState({ submitted: false });
      refreshInstance(Date.now());
    }
  }, [formState]);

  return (
    <Card className="my-3">
      <CardBody>
        <div className="fieldset-label">Instance Name</div>
        <div className="fieldset">
          <Input
            onChange={(e) => updateForm({ ...formData, instance_name: e.target.value, error: false })}
            type="text"
            title="instance_name"
            value={formData.instance_name}
          />
        </div>

        {details.region && (
          <>
            <div className="fieldset-label">Instance Region (no modification)</div>
            <div className="fieldset">
              {details.region.label}
            </div>
          </>
        )}

        {storageProducts && (
          <>
            <div className="fieldset-label">Storage Size</div>
            <div className="fieldset full-height">
              <RadioCheckbox
                id="data_volume_size"
                className="radio-button"
                type="radio"
                onChange={(value) => updateForm({ ...formData, data_volume_size: value })}
                options={storageProducts}
                value={formData.data_volume_size}
                defaultValue={details.storage}
              />
            </div>
          </>
        )}

        <div className="fieldset-label">Instance Type</div>
        <div className="fieldset full-height">
          {computeProducts && (
            <RadioCheckbox
              id="stripe_plan_id"
              className="radio-button"
              type="radio"
              onChange={(value) => updateForm({ ...formData, stripe_plan_id: value })}
              options={computeProducts}
              value={formData.stripe_plan_id}
              defaultValue={details.compute}
            />
          )}
        </div>

        <hr className="mb-4" />

        <Row>
          <Col xs="5" className="text-nowrap">
            <b>{!hasChanged ? 'Current' : 'New'} Price</b>
          </Col>
          <Col xs="7" className="text-right text-nowrap">
            <b>${totalPrice.toFixed(2)}/{details.compute.interval}</b>
          </Col>
        </Row>

        <hr className="mt-4" />

        {hasChanged && totalPrice && !hasCard ? (
          <Button
            onClick={() => history.push(`/account/billing?returnURL=/instance/${details.compute_stack_id}/config`)}
            title="Confirm Instance Details"
            block
            disabled={!hasChanged}
            className="mt-3"
            color="danger"
          >
            Add Credit Card To Account
          </Button>
        ) : (
          <Button
            onClick={() => setFormState({ ...formData, submitted: true, error: false })}
            title="Confirm Instance Details"
            block
            disabled={!hasChanged}
            className="mt-3"
            color="purple"
          >
            Update Instance
          </Button>
        )}
      </CardBody>
    </Card>
  );
};
