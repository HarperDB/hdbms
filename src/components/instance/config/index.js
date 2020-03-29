import React, { useState } from 'react';
import { Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';

import appState from '../../../state/stores/appState';

import removeInstance from '../../../api/lms/removeInstance';
import updateInstance from '../../../api/lms/updateInstance';

import UpdateInstance from './updateInstance';
import RemoveInstance from './removeInstance';
import InstanceDetails from './instanceDetails';
import InstanceLogs from './instanceLogs';
import Loader from '../../shared/loader';
import getFingerprint from '../../../api/instance/getFingerprint';

export default () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [updatingInstance, setUpdatingInstance] = useState(false);
  const [removingInstance, setRemovingInstance] = useState(false);
  const history = useHistory();
  const alert = useAlert();

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
        <InstanceDetails />
      </Col>
      <Col lg="4" xs="12">
        <UpdateInstance setUpdatingInstance={setUpdatingInstance} />
        <RemoveInstance setRemovingInstance={setRemovingInstance} />
      </Col>
      <Col lg="8" xs="12">
        <InstanceLogs />
      </Col>
    </Row>
  );
};
