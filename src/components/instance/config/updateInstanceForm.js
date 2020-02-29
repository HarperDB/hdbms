import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Input, RadioCheckbox, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';

import useLMS from '../../../state/stores/lmsData';
import updateInstance from '../../../api/lms/updateInstance';
import updateLicense from '../../../api/lms/updateLicense';
import setLicense from '../../../api/instance/setLicense';
import defaultLMSData from '../../../state/defaults/defaultLMSData';
import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';

export default ({ instanceAuth, details, refreshInstance, computeProducts, storageProducts }) => {
  const [{ auth, customer, regions }] = useLMS(defaultLMSData);
  const history = useHistory();
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState({ instance_name: details.instance_name, stripe_plan_id: details.stripe_plan_id, storage_qty_gb: details.storage_qty_gb });
  const hasCard = customerHasChargeableCard(customer);
  const thisRegion = details.instance_region && regions && regions.find((r) => r.value === details.instance_region);

  let totalPrice = 0;
  const newComputePrice = computeProducts.find((p) => p.value === formData.stripe_plan_id);
  if (newComputePrice.price !== 'FREE') totalPrice += parseFloat(newComputePrice.price);

  if (storageProducts) {
    const newStoragePrice = storageProducts.find((p) => p.value === formData.storage_qty_gb);
    if (newStoragePrice.price !== 'FREE') totalPrice += parseFloat(newStoragePrice.price);
  }

  const hasChanged = details.stripe_plan_id !== formData.stripe_plan_id || details.storage_qty_gb !== formData.storage_qty_gb;

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { stripe_product_id, instance_name, instance_id, customer_id, license_id, fingerprint, storage_qty_gb } = formData;

      const newLicense = await updateLicense({ auth, payload: { license_id, stripe_product_id, instance_id, customer_id, fingerprint } });
      await setLicense({ auth: instanceAuth, key: newLicense.key, company: newLicense.company });
      await updateInstance({ auth, payload: { stripe_product_id, instance_id, customer_id, instance_name, storage_qty_gb } });
      setFormState({ submitted: false });
      refreshInstance(Date.now());
    }
  }, [formState]);

  return (
    <Card className="my-3">
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

        {thisRegion && (
          <>
            <div className="new-instance-label">Instance Region (no modification)</div>
            <div className="fieldset">
              {thisRegion.label}
            </div>
          </>
        )}

        {storageProducts && (
          <>
            <div className="new-instance-label">Storage Size</div>
            <div className="fieldset full-height">
              <RadioCheckbox
                id="storage_qty_gb"
                className="radio-button"
                type="radio"
                onChange={(value) => updateForm({ ...formData, storage_qty_gb: value })}
                options={storageProducts}
                value={formData.storage_qty_gb}
                defaultValue={details.storage_qty_gb ? storageProducts.find((p) => p.value === details.storage_qty_gb) : storageProducts[0]}
              />
            </div>
          </>
        )}

        <div className="new-instance-label">Instance Type</div>
        <div className="fieldset full-height">
          {computeProducts && (
            <RadioCheckbox
              id="stripe_plan_id"
              className="radio-button"
              type="radio"
              onChange={(value) => updateForm({ ...formData, stripe_plan_id: value })}
              options={computeProducts}
              value={formData.stripe_plan_id}
              defaultValue={details.stripe_plan_id ? computeProducts.find((p) => p.value === details.stripe_plan_id) : computeProducts[0]}
            />
          )}
        </div>

        <hr className="mb-4" />

        <Row>
          <Col xs="5" className="text-nowrap">
            <b>{!hasChanged ? 'Current' : 'New'} Price</b>
          </Col>
          <Col xs="7" className="text-right text-nowrap">
            <b>${totalPrice.toFixed(2)}/{computeProducts[0].interval}</b>
          </Col>
        </Row>

        <hr className="mt-4" />

        {hasChanged && totalPrice && !hasCard ? (
          <Button
            onClick={() => history.push(`/account/billing?returnURL=/instances/${details.instance_id}/config`)}
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
