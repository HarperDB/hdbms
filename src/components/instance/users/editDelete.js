import React, { useState } from 'react';
import { Button, CardBody, Card, Input, Col, Row } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useLocation, useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../state/instanceState';
import dropUser from '../../../api/instance/dropUser';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default () => {
  const { customer_id, compute_stack_id, username } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  const [formData, setFormData] = useState({});
  const [formState, setFormState] = useState({});
  const alert = useAlert();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);

  const deleteUser = async () => {
    if (formData.delete_username !== username) {
      alert.error('Please type the username to delete this user');
    } else {
      setFormState({ submitted: true });
      const response = await dropUser({ auth, username, url, is_local, compute_stack_id, customer_id });

      if (response.message.indexOf('successfully') !== -1) {
        alert.success(response.message);
        instanceState.update((s) => {
          s.lastUpdate = Date.now();
        });
        setFormState({});
        setTimeout(() => history.push(pathname.replace(`/users/${username}`, '/users')), 0);
      } else {
        alert.error(response.message);
        setFormState({});
      }
    }
  };

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <Row>
        <Col xs="8" className="py-1">
          Delete User
          <br />
          <span className="text-small">user will be removed from this instance</span>
        </Col>
        <Col xs="4">
          {username !== formData.delete_username ? (
            <Input
              onChange={(e) => setFormData({ delete_username: e.target.value })}
              type="text"
              className="text-center"
              title="confirm username to delete"
              placeholder={`Enter "${username}" here to enable deletion.`}
              value={formData.delete_username || ''}
            />
          ) : (
            <Button block color="danger" onClick={deleteUser} disabled={formState.submitted}>
              {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Delete User</span>}
            </Button>
          )}
        </Col>
      </Row>
    </ErrorBoundary>
  );
};
