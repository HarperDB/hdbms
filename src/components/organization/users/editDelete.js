import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useLocation, useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../functions/state/appState';
import updateOrgUser from '../../../functions/api/lms/updateOrgUser';
import getUsers from '../../../functions/api/lms/getUsers';
import addError from '../../../functions/api/lms/addError';
import ErrorFallback from '../../shared/errorFallback';

export default () => {
  const { user_id, customer_id } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  const alert = useAlert();
  const [formData, setFormData] = useState({});
  const [formState, setFormState] = useState({});
  const auth = useStoreState(appState, (s) => s.auth);

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      if (formData.delete_confirm !== 'DELETE') {
        alert.error('Please type the username to delete this user');
      } else {
        const response = await updateOrgUser({ auth, user_id, user_id_owner: auth.user_id, customer_id, status: 'removed' });
        if (response.error) {
          alert.error(response.message);
        } else {
          alert.success(`User deleted successfully`);
          getUsers({ auth, customer_id });
          setTimeout(() => history.push(pathname.replace(`/${user_id}`, '')), 100);
        }
      }
    }
  }, [formState]);

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id })} FallbackComponent={ErrorFallback}>
      <Row>
        <Col xs="8" className="py-1">
          Delete User
          <br />
          <span className="text-small">user will be removed from this organization</span>
        </Col>
        <Col xs="4">
          {formData.delete_confirm !== 'DELETE' ? (
            <Input
              id="username"
              onChange={(e) => setFormData({ delete_confirm: e.target.value })}
              type="text"
              className="text-center"
              title="confirm username to delete"
              placeholder={`Enter "DELETE" here to enable deletion.`}
              value={formData.delete_confirm || ''}
            />
          ) : (
            <Button id="deleteOrganizationUser" block color="danger" onClick={() => setFormState({ submitted: true })} disabled={formState.submitted}>
              {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Delete User</span>}
            </Button>
          )}
        </Col>
      </Row>
    </ErrorBoundary>
  );
};
