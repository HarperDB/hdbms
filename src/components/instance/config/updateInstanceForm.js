import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Input, RadioCheckbox, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import updateInstance from '../../../api/lms/updateInstance';
import updateLicense from '../../../api/lms/updateLicense';
import setLicense from '../../../api/instance/setLicense';
import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import instanceState from '../../../state/stores/instanceState';

export default () => {
  const lmsAuth = useStoreState(appState, (s) => s.auth);
  const customer = useStoreState(appState, (s) => s.customer);
  const { auth, url, compute_stack_id, instance_name, stripe_plan_id, data_volume_size, computeProducts, storageProducts, instance_region, storage, compute } = useStoreState(instanceState);
  const history = useHistory();
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({ instance_name, stripe_plan_id, data_volume_size });
  const hasCard = customerHasChargeableCard(customer);

  let totalPrice = 0;

  if (computeProducts) {
    const newComputePrice = computeProducts.find((p) => p.value === formData.stripe_plan_id);
    if (newComputePrice.price !== 'FREE') totalPrice += parseFloat(newComputePrice.price);
  }

  if (storageProducts) {
    const newStoragePrice = storageProducts.find((p) => p.value === formData.data_volume_size);
    if (newStoragePrice.price !== 'FREE') totalPrice += parseFloat(newStoragePrice.price);
  }


  const hasChanged = stripe_plan_id !== formData.stripe_plan_id || data_volume_size !== formData.data_volume_size;

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { key, company } = await updateLicense({ auth: lmsAuth, payload: formData });
      await setLicense({ auth, key, company, url });
      await updateInstance({ auth: lmsAuth, payload: formData });
      setFormState({ submitted: false });
      instanceState.update((s) => { s.lastUpdate = Date.now(); });
    }
  }, [formState]);

  return computeProducts ? (
    <Card className="my-3">
      <CardBody>
        {/*
        <div className="fieldset-label">Instance Name</div>
        <div className="fieldset">
          <Input
            onChange={(e) => updateForm({ ...formData, instance_name: e.target.value })}
            type="text"
            title="instance_name"
            value={formData.instance_name}
          />
        </div>
        */}

        {instance_region && (
          <>
            <div className="fieldset-label">Instance Region (no modification)</div>
            <div className="fieldset">
              {instance_region}
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
                defaultValue={storage}
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
              defaultValue={compute}
            />
          )}
        </div>

        <hr className="mb-4" />

        <Row>
          <Col xs="5" className="text-nowrap">
            <b>{!hasChanged ? 'Current' : 'New'} Price</b>
          </Col>
          <Col xs="7" className="text-right text-nowrap">
            <b>${totalPrice.toFixed(2)}/{compute.interval}</b>
          </Col>
        </Row>

        <hr className="mt-4" />

        {hasChanged && totalPrice && !hasCard ? (
          <Button
            onClick={() => history.push(`/account/billing?returnURL=/instance/${compute_stack_id}/config`)}
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
            onClick={() => setFormState({ submitted: true })}
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
  ) : (
    <i className="fa fa-spinner fa-spin text-white" />
  );
};
