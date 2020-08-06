import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import SelectDropdown from 'react-select';
import useAsyncEffect from 'use-async-effect';
import { useHistory, useParams } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import appState from '../../../state/appState';
import instanceState from '../../../state/instanceState';
import config from '../../../config';

import ChangeSummary from './changeSummary';
import updateInstance from '../../../api/lms/updateInstance';
import commaNumbers from '../../../methods/util/commaNumbers';

export default ({ setInstanceAction, showPrepaidCompute }) => {
  const { customer_id, compute_stack_id } = useParams();
  const history = useHistory();
  const alert = useAlert();
  const auth = useStoreState(appState, (s) => s.auth);
  const hasCard = useStoreState(appState, (s) => s.hasCard);
  const compute = useStoreState(instanceState, (s) => s.compute);
  const storage = useStoreState(instanceState, (s) => s.storage);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const compute_subscription_id = useStoreState(instanceState, (s) => s.compute_subscription_id);
  const is_being_modified = useStoreState(instanceState, (s) => !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(s.status));

  const filteredProducts = useStoreState(appState, (s) => s.products[is_local ? 'local_compute' : 'cloud_compute']);
  const filteredSubscriptions = useStoreState(appState, (s) =>
    s.subscriptions[is_local ? 'local_compute' : 'cloud_compute'].filter((p) => p.value.compute_subscription_id === compute_subscription_id || p.value.compute_quantity_available)
  );
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ compute_stack_id, customer_id, ...compute });

  const products = showPrepaidCompute ? filteredSubscriptions : filteredProducts;
  const selectedProduct = products.find((p) => p.value.stripe_plan_id === formData.stripe_plan_id && p.value.compute_subscription_id === formData.compute_subscription_id);
  const totalFreeCloudInstances = auth.orgs.filter((o) => auth.user_id === o.owner_user_id).reduce((a, b) => a + b.free_cloud_instance_count, 0);
  const canAddFreeCloudInstance = totalFreeCloudInstances < config.free_cloud_instance_limit;
  const newTotal = (storage?.storage_price || 0) + (formData?.compute_price || 0);
  const newTotalString = newTotal ? `$${commaNumbers(newTotal.toFixed(2))}/${compute.compute_interval}` : 'FREE';
  const hasChanged = compute?.stripe_plan_id !== formData.stripe_plan_id || formData.compute_subscription_id !== compute?.compute_subscription_id;

  const resetFormData = () => setFormData({ compute_stack_id, customer_id, ...compute });

  useAsyncEffect(resetFormData, [showPrepaidCompute]);

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      if (!newTotal && !formData.compute_subscription_id && !is_local && !canAddFreeCloudInstance) {
        alert.error(`You are limited to ${config.free_cloud_instance_limit} free cloud instance${config.free_cloud_instance_limit !== 1 ? 's' : ''}`);
        resetFormData();
        setFormState({});
      } else {
        setInstanceAction('Updating');
        const response = await updateInstance({ auth, ...formData });

        if (response.error) {
          alert.error('There was an error updating your instance. Please try again later.');
          setInstanceAction(false);
        } else {
          alert.success('Instance update initialized successfully');
          appState.update((s) => {
            s.lastUpdate = Date.now();
          });
          setTimeout(() => history.push(`/o/${customer_id}/instances`), 100);
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
        onChange={({ value }) => setFormData({ ...formData, ...value })}
        options={products.filter((p) => p.value.active)}
        value={selectedProduct}
        defaultValue={compute}
        isSearchable={false}
        isClearable={false}
        isLoading={!products}
        placeholder="select a RAM allotment"
        styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
      />
      {hasChanged && !newTotal && !formData.compute_subscription_id && !is_local && !canAddFreeCloudInstance ? (
        <Card className="error mt-2">
          <CardBody>
            You are limited to {config.free_cloud_instance_limit} free cloud instance{config.free_cloud_instance_limit !== 1 ? 's' : ''}
          </CardBody>
        </Card>
      ) : hasChanged && (storage?.storage_price || formData?.compute_price) && !hasCard ? (
        <Button
          onClick={() => history.push(`/o/${customer_id}/billing?returnURL=/${customer_id}/i/${compute_stack_id}/config`)}
          title="Confirm Instance Details"
          block
          disabled={!hasChanged || formState.submitted}
          color="danger"
          className="mt-2"
        >
          Add Credit Card To Account
        </Button>
      ) : hasChanged ? (
        <>
          <ChangeSummary
            which="compute"
            compute={formData.compute_price_string_with_interval}
            storage={storage?.storage_price_string_with_interval || 'FREE'}
            total={newTotalString}
          />
          <Row>
            <Col>
              <Button onClick={resetFormData} title="Cancel" block disabled={formState.submitted} color="grey">
                Cancel
              </Button>
            </Col>
            <Col>
              <Button onClick={() => setFormState({ submitted: true })} title="Confirm Instance Details" block disabled={!hasChanged || formState.submitted} color="success">
                Update
              </Button>
            </Col>
          </Row>
        </>
      ) : null}
    </>
  );
};
