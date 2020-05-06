import React, { useMemo, useState } from 'react';
import { Button, Card, CardBody, Input, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import removeInstance from '../../../api/lms/removeInstance';
import appState from '../../../state/appState';
import useInstanceAuth from '../../../state/instanceAuths';

const CardBackDelete = ({ compute_stack_id, instance_name, is_local, setFlipState, flipState }) => {
  const alert = useAlert();
  const { auth, customer } = useStoreState(appState, (s) => ({
    auth: s.auth,
    customer: s.customer,
  }));
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = useMemo(() => instanceAuths && instanceAuths[compute_stack_id], [instanceAuths, compute_stack_id]);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { delete_instance_name } = formData;

      if (instance_name.toString() !== delete_instance_name?.toString()) {
        setFormState({
          error: 'instance name is not correct',
        });
      } else {
        const response = await removeInstance({ auth, customer_id: customer.customer_id, compute_stack_id });

        if (response.error) {
          alert.error('There was an error removing your instance. Please try again later.');
        } else {
          alert.success('Instance deletion initiated');
          if (instanceAuth) {
            setInstanceAuths({ ...instanceAuths, [compute_stack_id]: false });
          }

          setTimeout(
            () =>
              appState.update((s) => {
                s.lastUpdate = Date.now();
              }),
            1000
          );
        }
      }
    }
  }, [formState]);

  return (
    <Card className="instance">
      {flipState && ( // don't render the forms unless the card is flipped, as the autocomplete icon shows through
        <CardBody>
          {is_local ? (
            <ul className="text-small my-0">
              <li>
                <b>DOES NOT</b> uninstall HarperDB.
              </li>
              <li>
                <b>DOES</b> leave all your data intact.
              </li>
            </ul>
          ) : (
            <ul className="text-small my-0">
              <li>
                <b>THIS IS</b> an irreversible process.
              </li>
              <li>
                <b>IT CANNOT</b> be undone.
              </li>
            </ul>
          )}
          <Input
            onChange={(e) => setFormData({ delete_instance_name: e.target.value })}
            type="text"
            title="instance_name"
            className="my-3"
            placeholder={`Enter "${instance_name}" here to confirm.`}
            value={formData.instance_name}
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
                title="Confirm Instance Details"
                block
                disabled={formState.submitted || instance_name?.toString() !== formData.delete_instance_name?.toString()}
                color="danger"
              >
                {formState.submitted ? <i className="fa fa-spinner fa-spin" /> : <span>Do It</span>}
              </Button>
            </Col>
          </Row>
        </CardBody>
      )}
    </Card>
  );
};

export default CardBackDelete;
