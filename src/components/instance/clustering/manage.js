import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, ModalHeader, ModalBody, Modal, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../state/appState';
import instanceState from '../../../state/instanceState';

import InstanceManager from './manageInstances';
import DataTable from './manageDatatable';
import ManageEmptyPrompt from './manageEmptyPrompt';
import getInstances from '../../../api/lms/getInstances';
import config from '../../../config';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default () => {
  const { compute_stack_id, customer_id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const auth = useStoreState(appState, (s) => s.auth);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const subscriptions = useStoreState(appState, (s) => s.subscriptions);
  const instances = useStoreState(appState, (s) => s.instances);
  const instance_name = useStoreState(instanceState, (s) => s.instance_name, [compute_stack_id]);
  const clustering = useStoreState(instanceState, (s) => s.clustering, [compute_stack_id]);

  const refreshInstances = useCallback(() => {
    if (auth && products && regions && subscriptions && customer_id) {
      getInstances({ auth, customer_id, products, regions, subscriptions, instanceCount: instances?.length });
    }
  }, [auth, products, regions, customer_id, subscriptions]);

  useEffect(refreshInstances, []);

  useInterval(refreshInstances, config.refresh_content_interval);

  const refreshInstance = useCallback(() => {
    instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
  });

  useEffect(refreshInstance, []);

  useInterval(() => {
    if (clustering?.connected?.find((i) => i.connection.state === 'connecting')) {
      refreshInstance();
    }
  }, 1000);

  return (
    <>
      <Row id="clustering">
        <Col xl="3" lg="4" md="6" xs="12">
          <ErrorBoundary
            onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
            FallbackComponent={ErrorFallback}
          >
            <InstanceManager items={clustering?.connected || []} setShowModal={setShowModal} itemType="connected" />
            {clustering?.unconnected?.length ? <InstanceManager items={clustering.unconnected} itemType="unconnected" /> : null}
            {clustering?.unregistered?.length ? <InstanceManager items={clustering.unregistered} itemType="unregistered" /> : null}
          </ErrorBoundary>
        </Col>
        <Col xl="9" lg="8" md="6" xs="12">
          {clustering?.connected?.length ? (
            <ErrorBoundary
              onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
              FallbackComponent={ErrorFallback}
            >
              <DataTable />
            </ErrorBoundary>
          ) : (
            <ManageEmptyPrompt message="Please connect at least one instance to configure clustering" />
          )}
        </Col>
      </Row>
      <Modal id="cluster-state-modal" isOpen={!!showModal} toggle={() => setShowModal(false)}>
        <ModalHeader toggle={() => setShowModal(false)}>Instance Cluster Error</ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <b>{instance_name}</b> is unable to open a connection to <b>{showModal}</b>.
              <hr />
              <ul>
                <li>Clustered instances must be able to reach each other. This may require allowing access through a firewall.</li>
                <li>Both instances must be running. In the event of a restart, instances will automatically attempt to reconnect.</li>
                <li>
                  Clustered instances must have the same cluster user <b>name</b> and <b>password</b>. You can edit an instance&apos;s cluster user credentials in the <b>config</b>{' '}
                  section.
                </li>
              </ul>
              <hr />
              If none of these help fix the issue, you can disconnect <b>{showModal}</b> from <b>{instance_name}</b> by clicking the purple disconnect button with the minus sign.
              <hr />
              <Button block onClick={() => setShowModal(false)} color="danger">
                OK
              </Button>
            </CardBody>
          </Card>
        </ModalBody>
      </Modal>
    </>
  );
};
