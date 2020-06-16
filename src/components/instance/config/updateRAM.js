import React, { useState } from 'react';
import { Button, Card, CardBody, SelectDropdown, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory, useParams } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import appState from '../../../state/appState';
import instanceState from '../../../state/instanceState';

import config from '../../../../config';

import ChangeSummary from './changeSummary';
import updateInstance from '../../../api/lms/updateInstance';
import commaNumbers from '../../../methods/util/commaNumbers';

export default ({ setInstanceAction }) => {
  const { customer_id, compute_stack_id } = useParams();
  const history = useHistory();
  const alert = useAlert();
  const stripe_plan_id = useStoreState(instanceState, (s) => s.stripe_plan_id);
  const computeProducts = useStoreState(instanceState, (s) => s.computeProducts);
  const compute = useStoreState(instanceState, (s) => s.compute);
  const storage = useStoreState(instanceState, (s) => s.storage);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const is_being_modified = useStoreState(instanceState, (s) => !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(s.status));
  const auth = useStoreState(appState, (s) => s.auth);
  const hasCard = useStoreState(appState, (s) => s.hasCard);
  const totalFreeCloudInstances = auth.orgs.filter((o) => auth.user_id === o.owner_user_id).reduce((a, b) => a + b.free_cloud_instance_count, 0);
  const canAddFreeCloudInstance = totalFreeCloudInstances < config.free_cloud_instance_limit;
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ compute_stack_id, customer_id, stripe_plan_id });

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

        const response = await updateInstance({ auth, compute_stack_id, customer_id, ...formData });

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
          onClick={() => history.push(`/o/${customer_id}/billing?returnURL=/${customer_id}/i/${compute_stack_id}/config`)}
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
