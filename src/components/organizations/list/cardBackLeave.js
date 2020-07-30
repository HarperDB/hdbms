import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../state/appState';
import updateUserOrgs from '../../../api/lms/updateUserOrgs';
import getUser from '../../../api/lms/getUser';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default ({ customer_id, customer_name, setFlipState, flipState }) => {
  const alert = useAlert();
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { delete_customer_name } = formData;

      if (customer_name.toString() !== delete_customer_name?.toString()) {
        setFormState({
          error: 'organization name is not correct',
        });
      } else {
        const response = await updateUserOrgs({ auth, customer_id, user_id: auth.user_id, status: 'removed' });

        if (response.error) {
          alert.error(response.message);
        } else {
          await getUser(auth);
          alert.success(`Organization removed from your profile successfully`);
        }
      }
    }
  }, [formState]);

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id })} FallbackComponent={ErrorFallback}>
      <Card className="instance">
        {flipState && ( // don't render the forms unless the card is flipped, as the autocomplete icon shows through
          <CardBody>
            <ul className="text-small my-0 text-nowrap">
              <li>
                <b>YOU</b> will be removed from the org.
              </li>
              <li>
                <b>THE ORG</b> will not be removed.
              </li>
            </ul>

            <Input
              onChange={(e) => setFormData({ delete_customer_name: e.target.value })}
              type="text"
              title="customer name"
              className="my-3"
              placeholder={`Enter "${customer_name}" here to confirm.`}
              value={formData.customer_name}
            />
            <Row>
              <Col>
                <Button onClick={() => setFlipState(false)} title="Cancel" block disabled={formState.submitted} color="grey">
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => setFormState({ submitted: true })}
                  title="Confirm Organization Details"
                  block
                  disabled={formState.submitted || customer_name?.toString() !== formData.delete_customer_name?.toString()}
                  color="danger"
                >
                  {formState.submitted ? <i className="fa fa-spinner fa-spin" /> : <span>Do It</span>}
                </Button>
              </Col>
            </Row>
          </CardBody>
        )}
      </Card>
    </ErrorBoundary>
  );
};
