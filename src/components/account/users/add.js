import React, { useState } from 'react';
import { Input, Button, Card, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import addUser from '../../../api/lms/addUser';
import isEmail from '../../../util/isEmail';

export default ({ setLastUpdate }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const alert = useAlert();
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});

  useAsyncEffect(async () => {
    const { firstname, lastname, email } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (!firstname || !lastname || !isEmail(email)) {
        setFormState({ error: 'All fields must be filled out' });
      } else {
        const response = await addUser({ auth, payload: { ...formData, customer_id: auth.customer_id } });
        if (response.result) {
          setLastUpdate(Date.now());
          alert.success(response.message);
          updateForm({});
          setFormState({});
        } else {
          setFormState({ error: response.message });
        }
      }
    }
  }, [formState]);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">add user</span>
      <Card className="my-3">
        <CardBody>
          <Input
            type="text"
            className="mb-2 text-center"
            name="first name"
            placeholder="first name"
            value={formData.firstname || ''}
            onChange={(e) => updateForm({ ...formData, firstname: e.target.value })}
            disabled={formState.submitted}
          />

          <Input
            type="text"
            className="mb-2 text-center"
            name="lastname"
            placeholder="last name"
            value={formData.lastname || ''}
            onChange={(e) => updateForm({ ...formData, lastname: e.target.value })}
            disabled={formState.submitted}
          />

          <Input
            type="text"
            className="mb-4 text-center"
            name="email"
            placeholder="email address"
            value={formData.email || ''}
            onChange={(e) => updateForm({ ...formData, email: e.target.value })}
            disabled={formState.submitted}
          />

          <Button
            color="purple"
            block
            onClick={() => setFormState({ submitted: true })}
            disabled={formState.submitted}
          >
            {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Add User</span>}
          </Button>
          {formData.error && (
            <div className="text-danger text-small text-center text-italic">
              <hr />
              {formData.error}
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};
