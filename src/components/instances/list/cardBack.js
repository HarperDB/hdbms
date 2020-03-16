import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import useInstanceAuth from '../../../state/stores/instanceAuths';

import queryInstance from '../../../api/queryInstance';

export default ({ compute_stack_id, url, flipCard, flipState }) => {
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { user, pass } = formData;
      if (!user || !pass) {
        setFormState({ error: 'all fields are required' });
      } else {
        const response = await queryInstance({ operation: 'describe_all' }, { user, pass }, url);

        if (response.error) {
          setFormState({ error: response.message.toString() });
        } else {
          updateForm({});
          setFormState({});
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
                onClick={() => { updateForm({}); flipCard(); }}
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
                onClick={() => setFormState({ submitted: true })}
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
