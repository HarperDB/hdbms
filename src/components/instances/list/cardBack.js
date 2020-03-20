import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Input, Row, Col } from '@nio/ui-kit';

import useInstanceAuth from '../../../state/stores/instanceAuths';

export default ({ compute_stack_id, flipCard, flipState }) => {
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  useEffect(() => {
    const { submitted } = formState;
    if (submitted) {
      const { user, pass } = formData;
      if (!user || !pass) {
        setFormState({ error: 'all fields are required' });
      } else {
        setFormState({});
        setInstanceAuths({ ...instanceAuths, [compute_stack_id]: { user: formData.user, pass: formData.pass } });
        flipCard();
      }
    }
  }, [formState]);

  return (
    <Card className="instance">
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
          {formState.error && (
            <div className="text-smaller pt-2 text-danger text-center">
              {formState.error}
            </div>
          )}
        </CardBody>
      )}
    </Card>
  );
};
