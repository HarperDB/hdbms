import React, { useState } from 'react';
import { Card, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';

import addInstance from '../../../api/lms/addInstance';
import useInstanceAuth from '../../../state/stores/instanceAuths';
import getInstances from '../../../api/lms/getInstances';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';
import useNewInstance from '../../../state/stores/newInstance';
import defaultNewInstanceData from '../../../state/defaults/defaultNewInstanceData';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';

export default ({ closeAndResetModal }) => {
  const alert = useAlert();
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [newInstance] = useNewInstance(defaultNewInstanceData);
  const [formState, setFormState] = useState({ error: false });
  const [appData, setAppData] = useApp(defaultAppData);
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  useAsyncEffect(async () => {
    const newInstanceObject = { ...newInstance };
    delete newInstanceObject.user;
    delete newInstanceObject.pass;

    console.log('adding instance', newInstanceObject);

    const response = await addInstance({ auth: lmsAuth, payload: newInstanceObject });
    if (response.result) {
      alert.success(response.message.message);
      setInstanceAuths({ ...instanceAuths, [response.message.instance_id]: { user: newInstance.user, pass: newInstance.pass } });
      const instances = await getInstances({ auth: lmsAuth, payload: { customer_id: appData.user.customer_id }, entities: { ...appData } });
      setAppData({ ...appData, instances });
      setTimeout(() => closeAndResetModal(), 0);
    } else {
      setFormState({ submitted: false, error: response.message.message });
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
