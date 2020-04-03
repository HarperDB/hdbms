import React, { useState } from 'react';
import { Button, Card, CardBody, SelectDropdown, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import appState from '../../../state/stores/appState';
import instanceState from '../../../state/stores/instanceState';

import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import ChangeSummary from './changeSummary';
import updateInstance from '../../../api/lms/updateInstance';

export default ({ instanceAction, setInstanceAction, storagePrice }) => {
  const history = useHistory();
  const alert = useAlert();
  const { auth, customer, cloudInstancesBeingModified, hasCard } = useStoreState(appState, (s) => ({
    auth: s.auth,
    customer: s.customer,
    cloudInstancesBeingModified: s.instances.filter((i) => !i.is_local && !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(i.status)).length,
    hasCard: customerHasChargeableCard(s.customer),
  }));
  const { compute_stack_id, stripe_plan_id, computeProducts, compute, is_local } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    stripe_plan_id: s.stripe_plan_id,
    computeProducts: s.computeProducts,
    compute: s.compute,
    is_local: s.is_local,
  }));
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({
    compute_stack_id,
    customer_id: customer.customer_id,
    stripe_plan_id,
  });

  let totalPrice = 0;
  let newCompute;

  if (computeProducts) {
    newCompute = computeProducts.find((p) => p.value === formData.stripe_plan_id);
    if (newCompute && newCompute.price !== 'FREE') totalPrice += parseFloat(newCompute.price);
  }

  const hasChanged = stripe_plan_id !== formData.stripe_plan_id;

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      setInstanceAction('Updating');

      const response = await updateInstance({
        auth,
        payload: {
          compute_stack_id,
          customer_id: customer.customer_id,
          ...formData,
        },
      });

      if (response.result === false) {
        alert.error('There was an error updating your instance. Please try again later.');
        setInstanceAction(false);
      } else {
        alert.success('Instance update initialized successfully');
        appState.update((s) => {
          s.lastUpdate = Date.now();
        });
        setTimeout(() => history.push('/instances'), 3000);
      }
    }
  }, [formState]);

  return !is_local && cloudInstancesBeingModified ? (
    <Card className="error">
      <CardBody>another cloud instance is being modified. please wait.</CardBody>
    </Card>
  ) : (
    <>
      <SelectDropdown
        classNamePrefix="react-select"
        onChange={({ value }) =>
          setFormData({
            ...formData,
            stripe_plan_id: value,
          })
        }
        options={computeProducts}
        value={computeProducts && computeProducts.find((p) => p.value === formData.stripe_plan_id)}
        defaultValue={compute}
        isSearchable={false}
        isClearable={false}
        isLoading={!computeProducts}
        placeholder="select a RAM allotment"
        styles={{
          placeholder: (styles) => ({
            ...styles,
            textAlign: 'center',
            width: '100%',
            color: '#BCBCBC',
          }),
        }}
      />

      {hasChanged && (
        <ChangeSummary
          which="compute"
          compute={totalPrice ? `$${totalPrice.toFixed(2)}/${compute.interval}` : 'FREE'}
          storage={storagePrice ? `$${storagePrice.toFixed(2)}/${compute.interval}` : 'FREE'}
          total={totalPrice ? `$${(storagePrice + totalPrice).toFixed(2)}/${compute.interval}` : 'FREE'}
        />
      )}

      {hasChanged && totalPrice && !hasCard ? (
        <Button
          onClick={() => history.push(`/account/billing?returnURL=/instance/${compute_stack_id}/config`)}
          title="Confirm Instance Details"
          block
          disabled={!hasChanged || formState.submitted}
          color="danger"
        >
          Add Credit Card To Account
        </Button>
      ) : hasChanged ? (
        <Row>
          <Col>
            <Button
              onClick={() =>
                setFormData({
                  ...formData,
                  stripe_plan_id,
                })
              }
              title="Cancel"
              block
              disabled={formState.submitted}
              color="grey"
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() =>
                setFormState({
                  submitted: true,
                })
              }
              title="Confirm Instance Details"
              block
              disabled={!hasChanged || formState.submitted}
              color="success"
            >
              Update Instance RAM
            </Button>
          </Col>
        </Row>
      ) : null}
    </>
  );
};
