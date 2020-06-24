import React, { useState } from 'react';
import { Button, Input, CardBody, Card } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useLocation, useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';

import appState from '../../../state/appState';
import updateOrgUser from '../../../api/lms/updateOrgUser';
import getUsers from '../../../api/lms/getUsers';

const EditOrgUserRole = () => {
  const { user_id } = useParams();
  const { pathname } = useLocation();
  const { customer_id } = useParams();
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);
  const users = useStoreState(appState, (s) => s.users);
  const currentUser = users && users.find((u) => u.user_id === user_id);
  const currentStatus = currentUser && currentUser.orgs?.find((o) => o.customer_id?.toString() === customer_id)?.status;

  const [formState, setFormState] = useState({});

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const newRole = currentStatus === 'declined' ? 'invited' : currentStatus === 'accepted' ? 'owner' : 'accepted';
      const response = await updateOrgUser({ auth, user_id, user_id_owner: auth.user_id, customer_id, status: newRole });
      if (response.error) {
        setFormState({ error: response.message });
      } else {
        getUsers({ auth, customer_id });
        setTimeout(() => history.push(pathname.replace(`/${user_id}`, '')), 0);
      }
    }
  }, [formState]);

  return (
    <>
      <Input disabled className="text-center mb-2" type="text" placeholder={`Current Status: ${currentStatus === 'accepted' ? 'user' : currentStatus || '...'}`} />
      <Button disabled={!currentStatus || formState.submitted || currentStatus === 'invited'} block color="purple" onClick={() => setFormState({ submitted: true })}>
        {formState.submitted || !currentStatus ? (
          <i className="fa fa-spinner fa-spin text-white" />
        ) : currentStatus === 'invited' ? (
          <span>User Must First Accept Invite</span>
        ) : currentStatus === 'declined' ? (
          <span>Reinvite User</span>
        ) : currentStatus === 'accepted' ? (
          <span>Update Role to Owner</span>
        ) : (
          <span>Update Role to User</span>
        )}
      </Button>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
};

export default EditOrgUserRole;
