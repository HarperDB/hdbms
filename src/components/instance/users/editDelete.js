import React, { useState } from 'react';
import { Button, CardBody, Card, Col, Input, Row } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useLocation, useParams } from 'react-router-dom';
import { useHistory } from 'react-router';

import instanceState from '../../../state/instanceState';
import dropUser from '../../../api/instance/dropUser';

export default () => {
  const { username } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  const [formData, setFormData] = useState({});
  const [formState, setFormState] = useState({});
  const alert = useAlert();
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));

  const deleteUser = async () => {
    if (formData.delete_username !== username) {
      alert.error('Please type the username to delete this user');
    } else {
      const response = await dropUser({ auth, username, url });

      if (response.message.indexOf('successfully') !== -1) {
        alert.success(response.message);
        instanceState.update((s) => {
          s.lastUpdate = Date.now();
        });
        setTimeout(() => history.push(pathname.replace(`/${username}`, '')), 0);
      } else {
        setFormState({ error: response.message });
      }
    }
  };

  return (
    <Row>
      <Col sm="6">
        <Input
          onChange={(e) => setFormData({ delete_username: e.target.value })}
          type="text"
          className="text-center"
          title="confirm username to delete"
          placeholder={`Enter "${username}" here to enable user deletion.`}
          value={formData.delete_username || ''}
        />
      </Col>
      <Col sm="6">
        <Button block color="danger" onClick={deleteUser} disabled={username !== formData.delete_username}>
          Delete {username}
        </Button>
      </Col>
      <Col xs="12">
        {formState.error && (
          <Card className="mt-3 error">
            <CardBody>{formState.error}</CardBody>
          </Card>
        )}
      </Col>
    </Row>
  );
};
