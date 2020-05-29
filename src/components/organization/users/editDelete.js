import React, { useState } from 'react';
import { Button, CardBody, Card, Input } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useLocation, useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';

import appState from '../../../state/appState';
import updateOrgUser from '../../../api/lms/updateOrgUser';
import getUsers from '../../../api/lms/getUsers';

export default () => {
  const { user_id } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  const [formData, setFormData] = useState({});
  const [formState, setFormState] = useState({});
  const alert = useAlert();
  const auth = useStoreState(appState, (s) => s.auth);
  const customer_id = useStoreState(appState, (s) => s.customer?.customer_id);

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      if (formData.delete_confirm !== 'DELETE') {
        alert.error('Please type the username to delete this user');
      } else {
        const response = await updateOrgUser({ auth, user_id, user_id_owner: auth.user_id, customer_id, status: 'removed' });
        if (response.error) {
          setFormState({ error: response.message });
        } else {
          getUsers({ auth, customer_id });
          setTimeout(() => history.push(pathname.replace(`/${user_id}`, '')), 0);
        }
      }
    }
  }, [formState]);

  return (
    <>
      <Input
        onChange={(e) => setFormData({ delete_confirm: e.target.value })}
        type="text"
        className="text-center mb-2"
        title="confirm username to delete"
        placeholder={`Enter "DELETE" here to enable deletion.`}
        value={formData.delete_confirm || ''}
      />
      <Button block color="danger" onClick={() => setFormState({ submitted: true })} disabled={formState.submitted || formData.delete_confirm !== 'DELETE'}>
        {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Delete User</span>}
      </Button>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
};