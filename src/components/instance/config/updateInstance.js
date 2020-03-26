import React, { useState } from 'react';
import { Button, Card, CardBody, Col, RadioCheckbox, Row, SelectDropdown } from '@nio/ui-kit';
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
  const { auth, url, compute_stack_id, instance_name, is_local, stripe_plan_id, data_volume_size, computeProducts, storageProducts, instance_region, storage, compute } = useStoreState(instanceState);
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

  return (
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
  );
};
