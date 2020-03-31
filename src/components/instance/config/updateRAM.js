import React, { useState } from 'react';
import { Button, Card, CardBody, SelectDropdown } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';
import instanceState from '../../../state/stores/instanceState';

import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import ContentContainer from '../../shared/contentContainer';
import ChangeSummary from './changeSummary';

export default ({ setUpdatingInstance, storagePrice }) => {
  const customer = useStoreState(appState, (s) => s.customer);
  const cloudInstancesBeingModified = useStoreState(appState, (s) => s.instances.filter((i) => !i.is_local && !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(i.status)).length);
  const { compute_stack_id, stripe_plan_id, computeProducts, compute, is_local } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    stripe_plan_id: s.stripe_plan_id,
    computeProducts: s.computeProducts,
    compute: s.compute,
    is_local: s.is_local,
  }));
  const history = useHistory();
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({ compute_stack_id, customer_id: customer.customer_id, stripe_plan_id });
  const hasCard = customerHasChargeableCard(customer);

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
      if (!is_local && cloudInstancesBeingModified) {
        setFormState({ error: 'another cloud instance is being modified' });
      } else {
        setUpdatingInstance({ compute_stack_id, customer_id: customer.customer_id, ...formData });
      }
    }
  }, [formState]);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">update RAM</span>
      <Card className="my-3">
        <CardBody>
          <ContentContainer header="Instance RAM">
            <SelectDropdown
              classNamePrefix="react-select"
              onChange={({ value }) => updateForm({ ...formData, stripe_plan_id: value })}
              options={computeProducts}
              value={computeProducts && computeProducts.find((p) => p.value === formData.stripe_plan_id)}
              defaultValue={compute}
              isSearchable={false}
              isClearable={false}
              isLoading={!computeProducts}
              placeholder="select a RAM allotment"
              styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
            />
          </ContentContainer>

          {hasChanged && (
            <ChangeSummary
              which="compute"
              compute={totalPrice ? `$${totalPrice.toFixed(2)}/${compute.interval}` : 'FREE'}
              storage={storagePrice ? `$${storagePrice.toFixed(2)}/${compute.interval}` : 'FREE'}
              total={totalPrice ? `$${(storagePrice + totalPrice).toFixed(2)}/${compute.interval}` : 'FREE'}
            />
          )}

          {formState.error ? (
            <div className="mt-1">
              {formState.error}
            </div>
          ) : hasChanged && totalPrice && !hasCard ? (
            <Button
              onClick={() => history.push(`/account/billing?returnURL=/instance/${compute_stack_id}/config`)}
              title="Confirm Instance Details"
              block
              disabled={!hasChanged || formState.submitted}
              className="mt-1"
              color="danger"
            >
              Add Credit Card To Account
            </Button>
          ) : hasChanged ? (
            <Button
              onClick={() => setFormState({ submitted: true })}
              title="Confirm Instance Details"
              block
              disabled={!hasChanged || formState.submitted}
              className="mt-1"
              color="purple"
            >
              Update Instance
            </Button>
          ) : null}
        </CardBody>
      </Card>
      <br />
    </>
  );
};
