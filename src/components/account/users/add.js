import React, { useState } from 'react';
import { Input, Button, Card, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';

import addUser from '../../../api/lms/addUser';
import defaultUserFormData from '../../../state/defaults/defaultUserFormData';
import isEmail from '../../../util/isEmail';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';

export default ({ setLastUpdate, customerId }) => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const alert = useAlert();
  const [userForm, updateUserForm] = useState(defaultUserFormData);

  useAsyncEffect(async () => {
    if (userForm.submitted) {
      userForm.customer_id = customerId;
      if (!userForm.customer_id || !userForm.firstname || !userForm.lastname || !isEmail(userForm.email)) {
        updateUserForm({ ...userForm, submitted: false, error: 'All fields must be filled out' });
      } else {
        const response = await addUser({ auth: lmsAuth, payload: userForm });
        if (response.result) {
          updateUserForm(defaultUserFormData);
          setLastUpdate(Date.now());
          alert.success(response.message);
        } else {
          alert.error(response.message);
        }
      }
    }
  }, [userForm]);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">add user</span>
      <Card className="my-3">
        <CardBody>
          <div className="fieldset-label">first name</div>
          <div className="fieldset full-height">
            <Input
              type="text"
              className="mb-0 text-center"
              name="first name"
              value={userForm.firstname}
              onChange={(e) => updateUserForm({ ...userForm, firstname: e.target.value, error: false })}
            />
          </div>

          <div className="fieldset-label">last name</div>
          <div className="fieldset full-height">
            <Input
              type="text"
              className="mb-0 text-center"
              name="lastname"
              value={userForm.lastname}
              onChange={(e) => updateUserForm({ ...userForm, lastname: e.target.value, error: false })}
            />
          </div>

          <div className="fieldset-label">email address</div>
          <div className="fieldset full-height">
            <Input
              type="text"
              className="mb-0 text-center"
              name="email"
              value={userForm.email}
              onChange={(e) => updateUserForm({ ...userForm, email: e.target.value, error: false })}
            />
          </div>

          <Button
            color="success"
            block
            onClick={() => updateUserForm({ ...userForm, submitted: true, error: false })}
          >
            Add User
          </Button>
          {userForm.error && (
            <div className="text-danger text-small text-center text-italic">
              <hr />
              {userForm.error}
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};
