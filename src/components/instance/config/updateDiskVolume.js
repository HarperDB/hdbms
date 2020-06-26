import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row, SelectDropdown } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory, useParams } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import appState from '../../../state/appState';
import instanceState from '../../../state/instanceState';

import ChangeSummary from './changeSummary';
import updateInstance from '../../../api/lms/updateInstance';
import commaNumbers from '../../../methods/util/commaNumbers';
import config from '../../../config';

export default ({ setInstanceAction }) => {
  const { customer_id, compute_stack_id } = useParams();
  const history = useHistory();
  const alert = useAlert();
  const auth = useStoreState(appState, (s) => s.auth);
  const hasCard = useStoreState(appState, (s) => s.hasCard);
  const data_volume_size = useStoreState(instanceState, (s) => s.data_volume_size);
  const storageProducts = useStoreState(instanceState, (s) => s.storageProducts);
  const storage = useStoreState(instanceState, (s) => s.storage);
  const compute = useStoreState(instanceState, (s) => s.compute);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const last_volume_resize = useStoreState(instanceState, (s) => s.last_volume_resize);
  const is_being_modified = useStoreState(instanceState, (s) => !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(s.status));
  const totalFreeCloudInstances = auth.orgs.filter((o) => auth.user_id === o.owner_user_id).reduce((a, b) => a + b.free_cloud_instance_count, 0);
  const canAddFreeCloudInstance = totalFreeCloudInstances < config.free_cloud_instance_limit;
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ compute_stack_id, customer_id, data_volume_size });

  const newStorage = storageProducts && storageProducts.find((p) => p.value === formData.data_volume_size);
  const newTotal = (compute?.price || 0) + (newStorage?.price || 0);
  const newTotalString = newTotal ? `$${commaNumbers(newTotal.toFixed(2))}/${compute.interval}` : 'FREE';
  const hasChanged = data_volume_size !== formData.data_volume_size;
  const canChange = last_volume_resize ? (Date.now() - new Date(last_volume_resize).getTime()) / 1000 / 3600 > 6 : true;

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
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
  }, [formState]);

  return !canChange ? (
    <Card className="error">
      <CardBody>Limit 1 volume resize every 6 hours. Last: {new Date(last_volume_resize).toLocaleString()}</CardBody>
    </Card>
  ) : is_being_modified ? (
    <Card className="error">
      <CardBody>this instance is being modified. please wait.</CardBody>
    </Card>
  ) : (
    <>
      <SelectDropdown
        className="react-select-container"
        classNamePrefix="react-select"
        onChange={({ value }) => setFormData({ ...formData, data_volume_size: value })}
        options={storageProducts}
        value={storageProducts && storageProducts.find((p) => p.value === formData.data_volume_size)}
        defaultValue={storage}
        isSearchable={false}
        isClearable={false}
        isLoading={!storageProducts}
        placeholder="Select Data Volume Size"
        styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
      />

      {hasChanged && !newTotal && !is_local && !canAddFreeCloudInstance ? (
        <Card className="error mt-2">
          <CardBody>
            You are limited to {config.free_cloud_instance_limit} free cloud instance{config.free_cloud_instance_limit !== 1 ? 's' : ''}
          </CardBody>
        </Card>
      ) : hasChanged && (newStorage.price || compute.price) && !hasCard ? (
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
          <ChangeSummary which="storage" compute={compute?.priceStringWithInterval || 'FREE'} storage={newStorage?.priceStringWithInterval} total={newTotalString} />
          <Row>
            <Col>
              <Button onClick={() => setFormData({ ...formData, data_volume_size })} title="Cancel" block disabled={formState.submitted} color="grey">
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
