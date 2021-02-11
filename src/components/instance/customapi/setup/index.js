import React, { useState, useCallback } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../../functions/state/instanceState';

import Role from './Role';
import User from './User';
import Port from './Port';
import Enable from './Enable';
import EmptyPrompt from './EmptyPrompt';

import ErrorFallback from '../../../shared/ErrorFallback';
import addError from '../../../../functions/api/lms/addError';
import buildCustomAPI from '../../../../functions/instance/buildCustomAPI';
import restartInstance from '../../../../functions/api/instance/restartInstance';
import userInfo from '../../../../functions/api/instance/userInfo';
import enableCustomAPI from '../../../../functions/instance/enableCustomAPI';

const SetupIndex = () => {
  const { compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth, [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url, [compute_stack_id]);
  const custom_api = useStoreState(instanceState, (s) => s.custom_api, [compute_stack_id]);
  const custom_api_role = useStoreState(instanceState, (s) => s.custom_api?.custom_api_role, [compute_stack_id]);
  const custom_api_user = useStoreState(instanceState, (s) => s.custom_api?.custom_api_user, [compute_stack_id]);
  const custom_api_port = useStoreState(instanceState, (s) => s.custom_api?.custom_api_port, [compute_stack_id]);
  const [formState, setFormState] = useState({});

  useAsyncEffect(async () => {
    if (formState.submitted) {
      await enableCustomAPI({ auth, url });
      if (window.ORIBI) window.ORIBI.api('track', 'enabled custom api');
      await restartInstance({ auth, url });
      setTimeout(() => setFormState({ restarting: true }), 100);
    }
  }, [formState.submitted]);

  const checkInstance = useCallback(async () => {
    const response = await userInfo({ auth, url });
    if (!response.error) {
      buildCustomAPI({ auth, url });
    }
  }, [auth, url]);

  useInterval(() => {
    if (formState.restarting) {
      checkInstance();
    }
  }, 5000);

  return (
    <Row id="clustering">
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="floating-card-header">enable clustering</span>
        <Card className="my-3">
          <CardBody>
            <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
              <Role />
              {custom_api_role && <User />}
              {custom_api_role && custom_api_user && <Port />}
              {custom_api_role && custom_api_user && custom_api_port && <Enable setFormState={setFormState} disabled={formState.submitted || formState.restarting} />}
            </ErrorBoundary>
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        {formState.restarting ? (
          <EmptyPrompt description="Configuring Clustering" icon={<i className="fa fa-spinner fa-spin" />} />
        ) : custom_api_role && custom_api_user && custom_api_port ? (
          <EmptyPrompt
            headline="You're all set!"
            description="Click the button at left to enable the custom API. NOTE: We'll restart the instance when you click this button."
            icon={<i className="fa fa-thumbs-up text-success" />}
          />
        ) : custom_api_role && custom_api_user ? (
          <EmptyPrompt
            headline="Set Your Custom API Endpoint Port"
            description="If your instance is behind a firewall, you'll need to ensure this port is accessible by other instances if you want to access the API."
            icon={<i className="fa fa-thumbs-up text-success" />}
          />
        ) : custom_api_role ? (
          <EmptyPrompt
            headline="Create a Custom API User"
            description="This server-side user makes all the actual calls to HarperDB. Inbound users are different, and can be authenticated within the API."
            icon={<i className="fa fa-exclamation-triangle text-warning" />}
          />
        ) : (
          <EmptyPrompt
            headline="Create a Custom API Role"
            description="This role has super-user permissions and is exclusively for use by the Custom API User."
            icon={<i className="fa fa-exclamation-triangle text-warning" />}
          />
        )}
      </Col>
    </Row>
  );
};

export default SetupIndex;
