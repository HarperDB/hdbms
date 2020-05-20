import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Input, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';

import instanceState from '../../../state/instanceState';
import appState from '../../../state/appState';
import removeInstance from '../../../api/lms/removeInstance';

export default ({ setInstanceAction }) => {
  const history = useHistory();
  const alert = useAlert();
  const { auth, customer } = useStoreState(appState, (s) => ({
    auth: s.auth,
    customer: s.customer,
  }));
  const { compute_stack_id, instance_name, is_local, is_being_modified } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    instance_name: s.instance_name,
    is_local: s.is_local,
    is_being_modified: !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(s.status),
  }));
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { delete_instance_name } = formData;

      if (instance_name !== delete_instance_name) {
        setFormState({ error: 'instance name is not correct' });
      } else {
        setInstanceAction('Removing');

        const response = await removeInstance({ auth, customer_id: customer.customer_id, compute_stack_id });

        if (response.error) {
          alert.error('There was an error removing your instance. Please try again later.');
          setInstanceAction(false);
        } else {
          alert.success('Instance deletion initiated');
          appState.update((s) => {
            s.lastUpdate = Date.now();
          });
          setTimeout(() => history.push(`/${customer.customer_id}/instances`), 3000);
        }
      }
    }
  }, [formState]);

  return is_being_modified ? (
    <Card className="error">
      <CardBody>this instance is being modified. please wait.</CardBody>
    </Card>
  ) : (
    <>
      <Input
        onChange={(e) => setFormData({ delete_instance_name: e.target.value })}
        type="text"
        title="instance_name"
        placeholder={`Enter "${instance_name}" here to confirm.`}
        value={formData.delete_instance_name || ''}
      />

      {formData.delete_instance_name === instance_name && (
        <>
          <Card className="my-2">
            <CardBody className="px-2 pb-2 pt-3 text-small">
              {is_local ? (
                <ul className="text-small mb-0">
                  <li>
                    <b>DOES NOT</b> uninstall HarperDB.
                  </li>
                  <li>
                    <b>DOES</b> leave all your data intact.
                  </li>
                  <li>REMOVES your instance license.</li>
                  <li>STOPS recurring license charges.</li>
                  <li>LIMITS instance to 1GB RAM.</li>
                  <li>REMOVES instance from the Studio.</li>
                  <li>RESTARTS the instance.</li>
                </ul>
              ) : (
                <ul className="text-small mb-0">
                  <li>
                    <b>THIS IS</b> an irreversible process.
                  </li>
                  <li>
                    <b>IT CANNOT</b> be undone.
                  </li>
                  <li>DELETES your instance completely.</li>
                  <li>STOPS recurring license charges.</li>
                  <li>REMOVES instance from the Studio.</li>
                </ul>
              )}
            </CardBody>
          </Card>
          <Row>
            <Col>
              <Button onClick={() => setFormData({ delete_instance_name: '' })} title="Cancel" block disabled={formState.submitted} color="grey">
                Cancel
              </Button>
            </Col>
            <Col>
              <Button onClick={() => setFormState({ submitted: true })} title="Confirm Instance Details" block disabled={formState.submitted} color="danger">
                Remove Instance
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
