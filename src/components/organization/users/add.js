import React, { useState } from 'react';
import { Input, Button } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import appState from '../../../state/appState';

import addUser from '../../../api/lms/addUser';
import isEmail from '../../../methods/util/isEmail';
import FormStatus from '../../shared/formStatus';

export default ({ refreshUsers, userEmails }) => {
  const { customer_id } = useParams();
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { email } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (!isEmail(email)) {
        setFormState({ error: 'Please enter a valid email' });
      } else if (userEmails && userEmails.includes(email)) {
        setFormState({ error: 'User already invited' });
      } else {
        setFormState({ processing: true });

        const response = await addUser({ auth, email, customer_id });
        if (response.error) {
          setFormState({ error: response.message });
        } else {
          refreshUsers();
          setFormState({ success: response.message });
        }
      }
      setTimeout(() => setFormData({}), 2000);
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({}), [formData]);

  return formState.processing ? (
    <FormStatus height="173px" status="processing" header="Adding User" subhead="The Account Airedale Is A Good Boy" />
  ) : formState.success ? (
    <FormStatus height="173px" status="success" header="Success!" subhead={formState.success} />
  ) : formState.error ? (
    <FormStatus height="171px" status="error" header={formState.error} subhead="Please try again" />
  ) : (
    <>
      <Input
        type="text"
        className="mb-3 text-center"
        name="email"
        placeholder="email address"
        onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
        disabled={formState.submitted}
      />

      <Button color="purple" block onClick={() => setFormState({ submitted: true })} disabled={formState.submitted}>
        Add User
      </Button>
    </>
  );
};
