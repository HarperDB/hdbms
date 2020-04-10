import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import useInstanceAuth from '../../../state/stores/instanceAuths';
import userInfo from '../../../api/instance/userInfo';

export default ({ compute_stack_id, url, is_ssl, flipCard, flipState }) => {
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { user, pass } = formData;
      if (!user || !pass) {
        setFormState({
          error: 'All fields are required',
        });
      } else {
        const result = await userInfo({ auth: { user, pass }, url });

        if (is_ssl && result.error && result.type === 'catch') {
          setFormState({
            error: 'Login failed. Click to verify status?',
            url,
          });
        } else if (result.error && result.type === 'catch') {
          setFormState({
            error: "Can't reach non-SSL instance. Enable SSL?",
            url: 'https://harperdbhelp.zendesk.com/hc/en-us/articles/115000831074-SSL-with-HarperDB',
          });
        } else if (result.error) {
          setFormState({
            error: 'Login failed.',
          });
        } else {
          setInstanceAuths({
            ...instanceAuths,
            [compute_stack_id]: {
              user: formData.user,
              pass: formData.pass,
            },
          });
          flipCard();
        }
      }
    }
  }, [formState]);

  return (
    <Card className="instance">
      {flipState && ( // don't render the forms unless the card is flipped, as the autocomplete icon shows through
        <CardBody>
          <Input
            onChange={(e) =>
              setFormData({
                ...formData,
                user: e.target.value,
              })
            }
            className="text-center mb-1"
            type="text"
            title="username"
            placeholder="user"
            disabled={formState.submitted}
          />
          <Input
            onChange={(e) =>
              setFormData({
                ...formData,
                pass: e.target.value,
              })
            }
            className="text-center mb-2"
            type="password"
            title="password"
            placeholder="password"
            disabled={formState.submitted}
          />
          <Row noGutters>
            <Col xs="6" className="pr-1">
              <Button
                onClick={() => {
                  setFormData({});
                  setFormState({});
                  flipCard();
                }}
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
                onClick={() =>
                  setFormState({
                    submitted: true,
                  })
                }
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
            <a href={formState.url || null} target="_blank" rel="noopener noreferrer" className="text-bold text-center text-smaller text-danger d-block mt-2">
              {formState.error}
              {formState.url && <i className="ml-2 fa fa-lg fa-external-link-square text-purple" />}
            </a>
          )}
        </CardBody>
      )}
    </Card>
  );
};
