import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../../functions/state/instanceState';

import Port from './Port';
import Enable from './Enable';
import EmptyPrompt from '../../../shared/EmptyPrompt';

import ErrorFallback from '../../../shared/ErrorFallback';
import addError from '../../../../functions/api/lms/addError';
import restartInstance from '../../../../functions/api/instance/restartInstance';
import enableCustomFunctions from '../../../../functions/instance/enableCustomFunctions';

function SetupIndex({ setConfiguring }) {
  const { compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth, [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url, [compute_stack_id]);
  const custom_functions_port = useStoreState(instanceState, (s) => s.custom_functions?.port, [compute_stack_id]);
  const [formState, setFormState] = useState({});

  useAsyncEffect(async () => {
    if (formState.submitted) {
      await enableCustomFunctions({ auth, url });
      setConfiguring(true);
      if (window._kmq) window._kmq.push(['record', 'enabled custom functions']);
      setTimeout(() => {
        restartInstance({ auth, url });
      }, 1000);
    }
  }, [formState.submitted]);

  return (
    <Row id="clustering">
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="floating-card-header">enable custom functions</span>
        <Card className="my-3">
          <CardBody>
            <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
              <Port />
              {!!custom_functions_port && <Enable setFormState={setFormState} disabled={formState.submitted || formState.restarting} />}
            </ErrorBoundary>
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        {custom_functions_port ? (
          <EmptyPrompt
            headline="Enable Custom Functions"
            description="Click the button at left to enable Custom Functions. NOTE: We'll restart the instance when you click this button."
            icon={<i className="fa fa-thumbs-up text-success" />}
          />
        ) : (
          <EmptyPrompt
            headline="Set Your Custom Functions Server Port"
            description="If your instance is behind a firewall, you'll need to ensure this port is accessible by other instances if you want to access the API."
            icon={<i className="fa fa-thumbs-up text-success" />}
          />
        )}
      </Col>
    </Row>
  );
}

export default SetupIndex;
