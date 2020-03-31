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

export default ({ setUpdatingInstance, computePrice }) => {
  const customer = useStoreState(appState, (s) => s.customer);
  const cloudInstancesBeingModified = useStoreState(appState, (s) => s.instances.filter((i) => !i.is_local && !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(i.status)).length);
  const { compute_stack_id, data_volume_size, storageProducts, storage, is_local } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    data_volume_size: s.data_volume_size,
    storageProducts: s.storageProducts,
    storage: s.storage,
    is_local: s.is_local,
  }));
  const history = useHistory();
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({ compute_stack_id, customer_id: customer.customer_id, data_volume_size });
  const hasCard = customerHasChargeableCard(customer);

  let totalPrice = 0;
  let newStorage;

  if (storageProducts) {
    newStorage = storageProducts.find((p) => p.value === formData.data_volume_size);
    if (newStorage && newStorage.price !== 'FREE') totalPrice += parseFloat(newStorage.price);
  }

  const hasChanged = data_volume_size !== formData.data_volume_size;

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
      <span className="text-white mb-2 floating-card-header">resize disk volume</span>
      <Card className="my-3">
        <CardBody>
          <ContentContainer header="Instance Storage" className="mb-2">
            <SelectDropdown
              classNamePrefix="react-select"
              onChange={({ value }) => updateForm({ ...formData, data_volume_size: value })}
              options={storageProducts}
              value={storageProducts && storageProducts.find((p) => p.value === formData.data_volume_size)}
              defaultValue={storage}
              isSearchable={false}
              isClearable={false}
              isLoading={!storageProducts}
              placeholder="Select Data Volume Size"
              styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
            />
          </ContentContainer>

          {hasChanged && (
            <ChangeSummary
              which="storage"
              compute={computePrice ? `$${computePrice.toFixed(2)}/${storage.interval}` : 'FREE'}
              storage={totalPrice ? `$${totalPrice.toFixed(2)}/${storage.interval}` : 'FREE'}
              total={totalPrice ? `$${(computePrice + totalPrice).toFixed(2)}/${storage.interval}` : 'FREE'}
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
              Update Instance Storage
            </Button>
          ) : null}
        </CardBody>
      </Card>
      <br />
    </>
  );
};
