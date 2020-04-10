import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Input, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { useAlert } from 'react-alert';

import instanceState from '../../../state/stores/instanceState';
import userInfo from '../../../api/instance/userInfo';
import config from '../../../../config';
import restartInstance from '../../../api/instance/restartInstance';

export default ({ instanceAction, setInstanceAction }) => {
  const alert = useAlert();
  const { auth, url, instance_name, status } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    instance_name: s.instance_name,
    status: s.status,
    auth: s.auth,
    url: s.url,
  }));
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      setInstanceAction('Restarting');

      const response = await restartInstance({
        auth,
        url,
      });

      if (response.error) {
        setInstanceAction(false);
        alert.error('There was an error restarting your instance. Please try again later.');
      }
    }
  }, [formState]);

  const checkInstance = async () => {
    const response = await userInfo({ auth, url });
    if (!response.error) {
      setFormData({});
      setFormState({});
      setInstanceAction(false);
      alert.success('Instance restarted successfully');
    }
  };

  useInterval(() => {
    if (instanceAction === 'Restarting') {
      checkInstance();
    }
  }, config.instance_refresh_rate);

  return instanceAction === 'Restarting' ? (
    <Card className="error">
      <CardBody>
        <i className="fa fa-spin fa-spinner mr-2" />
        this instance is being restarted. please wait.
      </CardBody>
    </Card>
  ) : status && !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(status) ? (
    <Card className="error">
      <CardBody>this instance is being modified. please wait.</CardBody>
    </Card>
  ) : (
    <>
      <Input
        onChange={(e) =>
          setFormData({
            restart_instance_name: e.target.value,
          })
        }
        type="text"
        title="instance_name"
        placeholder={`Enter "${instance_name}" here to confirm.`}
        value={formData.instance_name}
      />

      {formData.restart_instance_name === instance_name && (
        <>
          <Card className="my-2">
            <CardBody className="px-2 pb-2 pt-3 text-small">
              <ul className="text-small mb-0">
                <li>
                  <b>WILL</b> interrupt connectivity.
                </li>
                <li>
                  <b>WILL</b> leave all your data intact.
                </li>
              </ul>
            </CardBody>
          </Card>
          <Row>
            <Col>
              <Button onClick={() => setFormData({})} title="Cancel" block disabled={formState.submitted} color="grey">
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() =>
                  setFormState({
                    submitted: true,
                  })
                }
                title="Confirm Instance Details"
                block
                disabled={formState.submitted}
                color="danger"
              >
                Restart Instance
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
