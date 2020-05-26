import React, { useState } from 'react';
import { Button, Card, CardBody, SelectDropdown, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import appState from '../../../state/appState';
import instanceState from '../../../state/instanceState';

import config from '../../../../config';

import ChangeSummary from './changeSummary';
import updateInstance from '../../../api/lms/updateInstance';
import commaNumbers from '../../../methods/util/commaNumbers';

export default ({ setInstanceAction }) => {
  const history = useHistory();
  const alert = useAlert();
  const { compute_stack_id, stripe_plan_id, computeProducts, compute, storage, is_being_modified, is_local } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    stripe_plan_id: s.stripe_plan_id,
    computeProducts: s.computeProducts,
    compute: s.compute,
    storage: s.storage,
    is_local: s.is_local,
    is_being_modified: !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(s.status),
  }));
  const { auth, customer, hasCard, canAddFreeCloudInstance } = useStoreState(appState, (s) => ({
    auth: s.auth,
    customer: s.customer,
    hasCard: s.hasCard,
    canAddFreeCloudInstance: s.instances && config.free_cloud_instance_limit > s.instances.filter((i) => !i.is_local && !i.compute.price).length,
  }));
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ compute_stack_id, customer_id: customer.customer_id, stripe_plan_id });

  const newCompute = computeProducts && computeProducts.find((p) => p.value === formData.stripe_plan_id);
  const newTotal = (storage?.price || 0) + (newCompute?.price || 0);
  const newTotalString = newTotal ? `$${commaNumbers(newTotal.toFixed(2))}/${compute.interval}` : 'FREE';
  const hasChanged = stripe_plan_id !== formData.stripe_plan_id;

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      if (!newTotal && !is_local && !canAddFreeCloudInstance) {
        alert.error(`You are limited to ${config.free_cloud_instance_limit} free cloud instance${config.free_cloud_instance_limit !== 1 ? 's' : ''}`);
        setFormData({ ...formData, stripe_plan_id });
        setFormState({});
      } else {
        setInstanceAction('Updating');

        const response = await updateInstance({ auth, compute_stack_id, customer_id: customer.customer_id, ...formData });

        if (response.error) {
          alert.error('There was an error updating your instance. Please try again later.');
          setInstanceAction(false);
        } else {
          alert.success('Instance update initialized successfully');
          appState.update((s) => {
            s.lastUpdate = Date.now();
          });
          setTimeout(() => history.push(`/${customer.customer_id}/instances`), 100);
        }
      }
    }
  }, [formState]);

  return is_being_modified ? (
    <Card className="error">
      <CardBody>this instance is being modified. please wait.</CardBody>
    </Card>
  ) : (
    <>
      <SelectDropdown
        className="react-select-container"
        classNamePrefix="react-select"
        onChange={({ value }) => setFormData({ ...formData, stripe_plan_id: value })}
        options={computeProducts}
        value={computeProducts && computeProducts.find((p) => p.value === formData.stripe_plan_id)}
        defaultValue={compute}
        isSearchable={false}
        isClearable={false}
        isLoading={!computeProducts}
        placeholder="select a RAM allotment"
        styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
      />
      {hasChanged && !newTotal && !is_local && !canAddFreeCloudInstance ? (
        <Card className="error mt-2">
          <CardBody>
            You are limited to {config.free_cloud_instance_limit} free cloud instance{config.free_cloud_instance_limit !== 1 ? 's' : ''}
          </CardBody>
        </Card>
      ) : hasChanged && (storage.price || newCompute.price) && !hasCard ? (
        <Button
          className="mt-2"
          onClick={() => history.push(`/${customer.customer_id}/billing?returnURL=/${customer.customer_id}/instance/${compute_stack_id}/config`)}
          title="Confirm Instance Details"
          block
          disabled={!hasChanged || formState.submitted}
          color="danger"
        >
          Add Credit Card To Account
        </Button>
      ) : hasChanged ? (
        <>
          <ChangeSummary which="compute" compute={newCompute?.priceStringWithInterval} storage={storage?.priceStringWithInterval || 'FREE'} total={newTotalString} />
          <Row>
            <Col>
              <Button onClick={() => setFormData({ ...formData, stripe_plan_id })} title="Cancel" block disabled={formState.submitted} color="grey">
                Cancel
              </Button>
            </Col>
            <Col>
              <Button onClick={() => setFormState({ submitted: true })} title="Confirm Instance Details" block disabled={!hasChanged || formState.submitted} color="success">
                Update RAM
              </Button>
            </Col>
          </Row>
        </>
      ) : null}
    </>
  );
};
