import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Row, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../functions/state/instanceState';
import appState from '../../../functions/state/appState';

import UpdateDiskVolume from './UpdateDiskVolume';
import UpdateRAM from './UpdateRAM';
import Remove from './Remove';
import Restart from './Restart';
import Details from './Details';
import Loader from '../../shared/Loader';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
import getPrepaidSubscriptions from '../../../functions/api/lms/getPrepaidSubscriptions';

const ConfigIndex = () => {
  const { customer_id, compute_stack_id } = useParams();
  const auth = useStoreState(appState, (s) => s.auth);
  const stripe_id = useStoreState(appState, (s) => s.customer?.stripe_id);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const compute_subscription_id = useStoreState(instanceState, (s) => s.compute_subscription_id);
  const storage_subscription_id = useStoreState(instanceState, (s) => s.storage_subscription_id);
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id), [customer_id]);
  const isOrgOwner = isOrgUser?.status === 'owner';
  const [instanceAction, setInstanceAction] = useState(false);
  const unusedCompute = useStoreState(
    appState,
    (s) => s.subscriptions[is_local ? 'local_compute' : 'cloud_compute']?.filter((p) => !p.value.compute_subscription_name || p.value.compute_quantity_available) || []
  );
  const unusedStorage = useStoreState(
    appState,
    (s) => s.subscriptions?.cloud_storage?.filter((p) => !p.value.storage_subscription_name || p.value.storage_quantity_available) || []
  );
  const [showPrepaidCompute, setShowPrepaidCompute] = useState(!!compute_subscription_id);
  const [showPrepaidStorage, setShowPrepaidStorage] = useState(!!storage_subscription_id);

  const refreshSubscriptions = () => {
    if (auth && customer_id && stripe_id) {
      getPrepaidSubscriptions({ auth, customer_id, stripe_id });
    }
  };

  useEffect(refreshSubscriptions, [auth, customer_id, stripe_id]);

  return instanceAction && instanceAction !== 'Restarting' ? (
    <Loader header={`${instanceAction} Instance`} spinner />
  ) : (
    <Row id="config">
      <Col xs="12">
        <ErrorBoundary
          onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
          FallbackComponent={ErrorFallback}
        >
          <Details />
        </ErrorBoundary>
      </Col>
      {isOrgOwner && (
        <Col lg="3" sm="6" xs="12">
          <Row>
            <Col>
              <span className="floating-card-header">update ram</span>
            </Col>
            <Col className="text-right">
              {(!!compute_subscription_id || !!unusedCompute.length) && (
                <span className="floating-card-header">
                  prepaid:{' '}
                  <Button id="showPrepaidCompute" color="link" onClick={() => setShowPrepaidCompute(!showPrepaidCompute)}>
                    <i className={`fa fa-lg fa-toggle-${showPrepaidCompute ? 'on' : 'off'}`} />
                  </Button>
                </span>
              )}
            </Col>
          </Row>
          <Card className="my-3">
            <CardBody>
              <ErrorBoundary
                onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
                FallbackComponent={ErrorFallback}
              >
                <UpdateRAM setInstanceAction={setInstanceAction} showPrepaidCompute={showPrepaidCompute} />
              </ErrorBoundary>
            </CardBody>
          </Card>
        </Col>
      )}
      {isOrgOwner && !is_local && (
        <Col lg="3" sm="6" xs="12">
          <Row>
            <Col>
              <span className="floating-card-header">update storage</span>
            </Col>
            <Col className="text-right">
              {(!!storage_subscription_id || !!unusedStorage.length) && (
                <span className="floating-card-header">
                  prepaid:{' '}
                  <Button id="showPrepaidStorage" color="link" onClick={() => setShowPrepaidStorage(!showPrepaidStorage)}>
                    <i className={`fa fa-lg fa-toggle-${showPrepaidStorage ? 'on' : 'off'}`} />
                  </Button>
                </span>
              )}
            </Col>
          </Row>
          <Card className="my-3">
            <CardBody>
              <ErrorBoundary
                onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
                FallbackComponent={ErrorFallback}
              >
                <UpdateDiskVolume setInstanceAction={setInstanceAction} showPrepaidStorage={showPrepaidStorage} />
              </ErrorBoundary>
            </CardBody>
          </Card>
        </Col>
      )}
      {isOrgOwner && (
        <Col lg="3" sm="6" xs="12">
          <span className="floating-card-header">remove instance</span>
          <Card className="my-3">
            <CardBody>
              <ErrorBoundary
                onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
                FallbackComponent={ErrorFallback}
              >
                <Remove setInstanceAction={setInstanceAction} instanceAction={instanceAction} />
              </ErrorBoundary>
            </CardBody>
          </Card>
        </Col>
      )}
      <Col lg="3" sm="6" xs="12">
        <span className="floating-card-header">restart instance</span>
        <Card className="my-3">
          <CardBody>
            <ErrorBoundary
              onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
              FallbackComponent={ErrorFallback}
            >
              <Restart setInstanceAction={setInstanceAction} instanceAction={instanceAction} />
            </ErrorBoundary>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ConfigIndex;
