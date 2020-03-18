import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import useInstanceAuth from '../../../state/stores/instanceAuths';
import useNewInstance from '../../../state/stores/newInstance';

import addInstance from '../../../api/lms/addInstance';
import addTCAcceptance from '../../../api/lms/addTCAcceptance';

export default ({ closeAndResetModal }) => {
  const lmsAuth = useStoreState(appState, (s) => s.auth);
  const alert = useAlert();
  const [newInstance] = useNewInstance({});
  const [formState, setFormState] = useState({ error: false });
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  useAsyncEffect(async () => {
    const newInstanceObject = { ...newInstance };
    delete newInstanceObject.user;
    delete newInstanceObject.pass;
    delete newInstanceObject.tc_version;

    const tcresponse = addTCAcceptance({ auth: lmsAuth, payload: { ...lmsAuth, tc_version: newInstance.tc_version } });
    console.log(tcresponse);

    const response = await addInstance({ auth: lmsAuth, payload: newInstanceObject });

    if (response.result) {
      alert.success(response.message);
      setInstanceAuths({ ...instanceAuths, [response.instance_id]: { user: newInstance.user, pass: newInstance.pass } });
      appState.update((s) => { s.lastUpdate = Date.now(); });
      setTimeout(() => closeAndResetModal(), 0);
    } else {
      setFormState({ submitted: false, error: response.message });
    }
  }, []);

  return formState.error ? (
    <div className="text-center p-3 pb-4">
      <i className="fa fa-2x fa-exclamation-triangle text-danger mb-4" /><br />
      {formState.error}
    </div>
  ) : (
    <div className="text-center p-3 pb-4">
      <i className="fa fa-2x fa-spinner fa-spin text-purple mb-4" /><br />
      The office dogs are typing furiously. Hang tight.
    </div>
  );
};
