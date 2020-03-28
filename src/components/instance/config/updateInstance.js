import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row, SelectDropdown } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';
import instanceState from '../../../state/stores/instanceState';

import updateInstance from '../../../api/lms/updateInstance';
import createLicense from '../../../api/lms/createLicense';
import setLicense from '../../../api/instance/setLicense';
import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';

export default () => {
  const { lmsAuth, customer } = useStoreState(appState, (s) => ({
    lmsAuth: s.auth,
    customer: s.customer,
  }));
  const { auth, url, compute_stack_id, is_local, stripe_plan_id, data_volume_size, computeProducts, storageProducts, storage, compute } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    compute_stack_id: s.compute_stack_id,
    instance_name: s.instance_name,
    is_local: s.is_local,
    stripe_plan_id: s.stripe_plan_id,
    data_volume_size: s.data_volume_size,
    computeProducts: s.computeProducts,
    storageProducts: s.storageProducts,
    storage: s.storage,
    compute: s.compute,
  }));
  const history = useHistory();
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({ compute_stack_id, stripe_plan_id, data_volume_size, customer_id: customer.customer_id });
  const hasCard = customerHasChargeableCard(customer);

  let totalPrice = 0;

  if (computeProducts) {
    const newComputePrice = computeProducts.find((p) => p.value === formData.stripe_plan_id);
    if (newComputePrice && newComputePrice.price !== 'FREE') totalPrice += parseFloat(newComputePrice.price);
  }

  if (storageProducts) {
    const newStoragePrice = storageProducts.find((p) => p.value === formData.data_volume_size);
    if (newStoragePrice && newStoragePrice.price !== 'FREE') totalPrice += parseFloat(newStoragePrice.price);
  }

  const hasChanged = stripe_plan_id !== formData.stripe_plan_id || data_volume_size !== formData.data_volume_size;

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const payload = Object.entries(formData).reduce((a, [k, v]) => (v ? { ...a, [k]: v } : a), {});
      console.log(payload);
      const instanceResult = await updateInstance({ auth: lmsAuth, payload });
      console.log(instanceResult);
      return false;

      const { key, company } = await createLicense({ auth: lmsAuth, payload: formData });
      await setLicense({ auth, key, company, url });
      setFormState({ submitted: false });
      instanceState.update((s) => { s.lastUpdate = Date.now(); });
    }
  }, [formState]);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">resize instance</span>
      <Card className="my-3">
        <CardBody>
          <div className="mb-3">
            <div className="fieldset-label">Instance RAM</div>
            <SelectDropdown
              classNamePrefix="react-select"
              onChange={({ value }) => updateForm({ ...formData, stripe_plan_id: value })}
              options={computeProducts}
              value={computeProducts && computeProducts.find((p) => p.stripe_plan_id === formData.stripe_plan_id)}
              defaultValue={compute}
              isSearchable={false}
              isClearable={false}
              isLoading={!computeProducts}
              placeholder="select a RAM allotment"
              styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
            />
          </div>

          {!is_local && (
            <div className="mb-3">
              <div className="fieldset-label">Instance Storage</div>
              <SelectDropdown
                classNamePrefix="react-select"
                onChange={({ value }) => updateForm({ ...formData, data_volume_size: value })}
                options={storageProducts}
                value={storageProducts && storageProducts.find((p) => p.data_volume_size === formData.data_volume_size)}
                defaultValue={storage}
                isSearchable={false}
                isClearable={false}
                isLoading={!storageProducts}
                placeholder="Select Data Volume Size"
                styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
              />
            </div>
          )}

          <hr />

          <Row>
            <Col xs="5" className="text-nowrap text-small">
              <b>{!hasChanged ? 'Current' : 'New'} Price</b>
            </Col>
            <Col xs="7" className="text-right text-nowrap text-small">
              <b>${totalPrice.toFixed(2)}/{compute.interval}</b>
            </Col>
          </Row>

          <hr />

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
      <br />
    </>
  );
};
