import React, { useState } from 'react';
import { Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import addUser from '../../../api/lms/addUser';
import isEmail from '../../../methods/util/isEmail';
import FormStatus from '../../shared/formStatus';

export default ({ setLastUpdate }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { firstname, lastname, email } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (!firstname || !lastname) {
        setFormState({
          error: 'All fields must be filled out',
        });
      } else if (!isEmail(email)) {
        setFormState({
          error: 'Please enter a valid email',
        });
      } else {
        setFormState({
          processing: true,
        });

        const response = await addUser({
          auth,
          payload: {
            ...formData,
            customer_id: auth.customer_id,
          },
        });
        if (response.result) {
          setLastUpdate(Date.now());
          setFormState({
            success: response.message,
          });
        } else {
          setFormState({
            error: response.message,
          });
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
        className="mb-2 text-center"
        name="first name"
        placeholder="first name"
        value={formData.firstname || ''}
        onChange={(e) =>
          setFormData({
            ...formData,
            firstname: e.target.value,
          })
        }
        disabled={formState.submitted}
      />

      <Input
        type="text"
        className="mb-2 text-center"
        name="lastname"
        placeholder="last name"
        value={formData.lastname || ''}
        onChange={(e) =>
          setFormData({
            ...formData,
            lastname: e.target.value,
          })
        }
        disabled={formState.submitted}
      />

      <Input
        type="text"
        className="mb-3 text-center"
        name="email"
        placeholder="email address"
        value={formData.email || ''}
        onChange={(e) =>
          setFormData({
            ...formData,
            email: e.target.value,
          })
        }
        disabled={formState.submitted}
      />

      <Button
        color="purple"
        block
        onClick={() =>
          setFormState({
            submitted: true,
          })
        }
        disabled={formState.submitted}
      >
        Add User
      </Button>
    </>
  );
};
