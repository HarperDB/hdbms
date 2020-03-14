import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';

import useInstanceAuth from '../../../state/stores/instanceAuths';

import queryInstance from '../../../api/queryInstance';

export default ({ compute_stack_id, url, flipCard, flipState }) => {
  const alert = useAlert();
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState({ user: false, pass: false });
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { user, pass } = formData;
      if (!user || !pass) {
        alert.error('all fields are required');
        setFormState({ error: true, submitted: false });
      } else {
        const response = await queryInstance({ operation: 'describe_all' }, { user, pass }, url);

        if (response.error) {
          alert.error(response.message.toString());
          setFormState({ error: true, submitted: false });
        } else {
          updateForm({ user: false, pass: false });
          setFormState({ error: false, submitted: false });
          setInstanceAuths({ ...instanceAuths, [compute_stack_id]: { user: formData.user, pass: formData.pass } });
          flipCard();
        }
      }
    }
  }, [formState]);

  return (
    <Card className={`instance ${formState.error ? 'error' : ''}`}>
      {flipState && ( // don't render the forms unless the card is flipped, as the autocomplete icon shows through
        <CardBody>
          <Input
            onChange={(e) => updateForm({ ...formData, user: e.target.value })}
            className="text-center mb-1"
            type="text"
            title="username"
            placeholder="user"
            disabled={formState.submitted}
          />
          <Input
            onChange={(e) => updateForm({ ...formData, pass: e.target.value })}
            className="text-center mb-2"
            type="password"
            title="password"
            placeholder="pass"
            disabled={formState.submitted}
          />
          <Row noGutters>
            <Col xs="6" className="pr-1">
              <Button
                onClick={() => { updateForm({ user: false, pass: false }); flipCard(); }}
                title="Cancel"
                block
                color="grey"
                disabled={formState.submitted}
              >
                Cancel
              </Button>
            </Col>
            <Col xs="6" className="pl-1">
              <Button
                onClick={() => setFormState({ submitted: true, error: false })}
                title="Log Into Instance"
                block
                color="purple"
                disabled={formState.submitted}
              >
                Log In
              </Button>
            </Col>
          </Row>
        </CardBody>
      )}
    </Card>
  );
};
