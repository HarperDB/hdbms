import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';

import config from '../../../../config';
import instanceState from '../../../state/instanceState';

import Role from './setupRole';
import User from './setupUser';
import Port from './setupPort';
import Enable from './setupEnable';
import NodeName from './setupNodeName';
import Instructions from './setupInstructions';
import Loader from '../../shared/loader';

import configureCluster from '../../../api/instance/configureCluster';
import restartInstance from '../../../api/instance/restartInstance';
import userInfo from '../../../api/instance/userInfo';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default () => {
  const { customer_id, compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth, [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url, [compute_stack_id]);
  const cluster_role = useStoreState(instanceState, (s) => s.network?.cluster_role, [compute_stack_id]);
  const cluster_user = useStoreState(instanceState, (s) => s.network?.cluster_user, [compute_stack_id]);
  const name = useStoreState(instanceState, (s) => s.network?.name, [compute_stack_id]);
  const [nodeNameMatch, setNodeNameMatch] = useState(compute_stack_id === name);
  const [formState, setFormState] = useState({});

  useAsyncEffect(async () => {
    if (formState.submitted) {
      await configureCluster({
        compute_stack_id,
        cluster_user,
        port: 12345,
        auth,
        url,
      });
      await restartInstance({ auth, url });
      setTimeout(() => setFormState({ restarting: true }), 100);
    }
  }, [formState.submitted]);

  const checkInstance = async () => {
    const response = await userInfo({ auth, url });
    if (!response.error) {
      instanceState.update((s) => {
        s.lastUpdate = Date.now();
      });
    }
  };

  useInterval(() => {
    if (formState.restarting) {
      checkInstance();
    }
  }, config.refresh_content_interval);

  return formState.restarting ? (
    <Loader header="configuring clustering" spinner />
  ) : (
    <Row id="clustering">
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="floating-card-header">enable clustering</span>
        <Card className="my-3">
          <CardBody>
            <ErrorBoundary
              onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
              FallbackComponent={ErrorFallback}
            >
              <Role />
              {cluster_role && <User />}
              {cluster_user && <Port port={12345} />}
              {cluster_role && cluster_user && <NodeName nodeNameMatch={nodeNameMatch} setNodeNameMatch={setNodeNameMatch} />}
              {cluster_role && cluster_user && nodeNameMatch && <Enable setFormState={setFormState} disabled={formState.submitted || formState.restarting} />}
            </ErrorBoundary>
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <span className="floating-card-header">&nbsp;</span>
        <Instructions showNodeNameInstructions={compute_stack_id !== name} />
      </Col>
    </Row>
  );
};
