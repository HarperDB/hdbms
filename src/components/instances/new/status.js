import React, { useState } from 'react';
import { Button, Card, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import useInstanceAuth from '../../../state/instanceAuths';
import useNewInstance from '../../../state/newInstance';

import addInstance from '../../../api/lms/addInstance';
import addTCAcceptance from '../../../api/lms/addTCAcceptance';

export default ({ closeAndResetModal }) => {
  const lmsAuth = useStoreState(appState, (s) => s.auth);
  const alert = useAlert();
  const [newInstance] = useNewInstance({});
  const [formState, setFormState] = useState({ error: false });
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  useAsyncEffect(async () => {
    const newInstanceObject = {
      ...newInstance,
    };
    delete newInstanceObject.user;
    delete newInstanceObject.pass;
    delete newInstanceObject.tc_version;

    addTCAcceptance({
      auth: lmsAuth,
      payload: {
        ...lmsAuth,
        tc_version: newInstance.tc_version,
      },
    });

    const response = await addInstance({
      auth: lmsAuth,
      payload: newInstanceObject,
    });

    if (response.result) {
      alert.success(response.message);
      setInstanceAuths({
        ...instanceAuths,
        [response.instance_id]: {
          user: newInstance.user,
          pass: newInstance.pass,
        },
      });
      appState.update((s) => {
        s.lastUpdate = Date.now();
      });
      setTimeout(() => closeAndResetModal(), 0);
    } else {
      const error = response.message?.indexOf('Can only have 1 free instance') !== -1 ? 'You are limited to 1 free cloud instance' : response.message;
      setFormState({
        submitted: false,
        error,
      });
    }
  }, []);

  return formState.error ? (
    <Card>
      <CardBody>
        <div className="p-4 text-center">
          <b>Uh Oh!</b>
          <br />
          <br />
          <i className="fa fa-lg fa-exclamation-triangle text-danger mb-4" />
          <br />
          {formState.error || 'there was an error creating your instance'}
          <br />
          <hr className="mt-4" />
          <Button onClick={closeAndResetModal}>Click Here To Try Again</Button>
          <hr className="mb-4" />
          If the issue persists, please contact <a href="mailto:support@harperdb.io">support@harperdb.io</a>.
        </div>
      </CardBody>
    </Card>
  ) : (
    <Card>
      <CardBody>
        <div className="p-4 text-center">
          <b>{newInstance.is_local ? 'Adding' : 'Creating'} Your Instance</b>
          <br />
          <br />
          <br />
          <i className="fa fa-lg fa-spinner fa-spin text-purple mb-4" />
          <br />
          <br />
          The Networking Samoyed is gnawing the CAT cables.
        </div>
      </CardBody>
    </Card>
  );
};
