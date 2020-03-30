import React, { useState } from 'react';
import { Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';

import appState from '../../../state/stores/appState';

import removeInstance from '../../../api/lms/removeInstance';
import updateInstance from '../../../api/lms/updateInstance';

import UpdateDiskVolume from './updateDiskVolume';
import UpdateRAM from './updateRAM';
import RemoveInstance from './removeInstance';
import InstanceDetails from './instanceDetails';
import InstanceLogs from './instanceLogs';
import Loader from '../../shared/loader';
import instanceState from '../../../state/stores/instanceState';

export default () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const { is_local, storage, compute } = useStoreState(instanceState, (s) => ({
    is_local: s.is_local,
    storage: s.storage,
    compute: s.compute,
  }));
  const [updatingInstance, setUpdatingInstance] = useState(false);
  const [removingInstance, setRemovingInstance] = useState(false);
  const history = useHistory();
  const alert = useAlert();

  let totalPrice = 0;

  if (compute) totalPrice += compute.price === 'FREE' ? 0 : parseFloat(compute.price);
  if (storage) totalPrice += storage.price === 'FREE' ? 0 : parseFloat(storage.price);

  useAsyncEffect(async () => {
    if (removingInstance) {
      const response = await removeInstance({ auth, payload: { customer_id: auth.customer_id, compute_stack_id: removingInstance } });

      if (response.result === false) {
        alert.error('There was an error removing your instance. Please try again later.');
        setRemovingInstance(false);
      } else {
        alert.success('Instance deleted successfully');
        appState.update((s) => { s.lastUpdate = Date.now(); });
        setTimeout(() => history.push('/instances'), 3000);
      }
    }
  }, [removingInstance]);

  useAsyncEffect(async () => {
    if (updatingInstance) {
      const response = await updateInstance({ auth, payload: updatingInstance });

      if (response.result === false) {
        alert.error('There was an error updating your instance. Please try again later.');
        setUpdatingInstance(false);
      } else {
        alert.success('Instance update initialized successfully');
        appState.update((s) => { s.lastUpdate = Date.now(); });
        setTimeout(() => history.push('/instances'), 3000);
      }
    }
  }, [updatingInstance]);

  return removingInstance ? (
    <Loader message="Removing Instance" />
  ) : updatingInstance ? (
    <Loader message="Updating Instance" />
  ) : (
    <Row id="config">
      <Col xs="12">
        <InstanceDetails totalPrice={totalPrice ? `$${totalPrice.toFixed(2)}/${compute.interval}` : 'FREE'} />
      </Col>
      <Col lg="4" xs="12">
        <UpdateRAM setUpdatingInstance={setUpdatingInstance} storagePrice={!storage || storage.price === 'FREE' ? 0 : parseFloat(storage.price)} />
        {!is_local && (
          <UpdateDiskVolume setUpdatingInstance={setUpdatingInstance} computePrice={!compute || compute.price === 'FREE' ? 0 : parseFloat(compute.price)} />
        )}
        <RemoveInstance setRemovingInstance={setRemovingInstance} />
      </Col>
      <Col lg="8" xs="12">
        <InstanceLogs />
      </Col>
    </Row>
  );
};
