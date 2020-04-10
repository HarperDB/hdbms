import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row, SelectDropdown } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import appState from '../../../state/appState';
import instanceState from '../../../state/instanceState';

import ChangeSummary from './changeSummary';
import updateInstance from '../../../api/lms/updateInstance';
import commaNumbers from '../../../methods/util/commaNumbers';

export default ({ setInstanceAction }) => {
  const history = useHistory();
  const alert = useAlert();
  const { auth, customer, cloudInstancesBeingModified, hasCard } = useStoreState(appState, (s) => ({
    auth: s.auth,
    customer: s.customer,
    cloudInstancesBeingModified: s.instances.filter((i) => !i.is_local && !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(i.status)).length,
    hasCard: s.hasCard,
  }));
  const { compute_stack_id, data_volume_size, storageProducts, storage, compute, last_volume_resize } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    data_volume_size: s.data_volume_size,
    storageProducts: s.storageProducts,
    storage: s.storage,
    compute: s.compute,
    last_volume_resize: s.last_volume_resize,
  }));
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({
    compute_stack_id,
    customer_id: customer.customer_id,
    data_volume_size,
  });

  const newStorage = storageProducts && storageProducts.find((p) => p.value === formData.data_volume_size);
  const newTotal = (compute?.price || 0) + (newStorage?.price || 0);
  const newTotalString = newTotal ? `$${commaNumbers(newTotal.toFixed(2))}/${compute.interval}` : 'FREE';
  const hasChanged = data_volume_size !== formData.data_volume_size;
  const canChange = last_volume_resize ? (Date.now() - new Date(last_volume_resize).getTime()) / 1000 / 3600 > 6 : true;

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

  return !canChange ? (
    <Card className="error">
      <CardBody>Limit 1 volume resize every 6 hours. Last: {new Date(last_volume_resize).toLocaleString()}</CardBody>
    </Card>
  ) : cloudInstancesBeingModified ? (
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
            data_volume_size: value,
          })
        }
        options={storageProducts}
        value={storageProducts && storageProducts.find((p) => p.value === formData.data_volume_size)}
        defaultValue={storage}
        isSearchable={false}
        isClearable={false}
        isLoading={!storageProducts}
        placeholder="Select Data Volume Size"
        styles={{
          placeholder: (styles) => ({
            ...styles,
            textAlign: 'center',
            width: '100%',
            color: '#BCBCBC',
          }),
        }}
      />

      {hasChanged && <ChangeSummary which="storage" compute={compute?.priceStringWithInterval || 'FREE'} storage={newStorage?.priceStringWithInterval} total={newTotalString} />}

      {hasChanged && (newStorage.price || compute.price) && !hasCard ? (
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
                  data_volume_size,
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
              Update Storage
            </Button>
          </Col>
        </Row>
      ) : null}
    </>
  );
};
