import React, { Suspense, useEffect, useCallback } from 'react';
import { Modal, ModalHeader, ModalBody, Card, CardBody, Button, Row, Col } from 'reactstrap';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../functions/state/appState';
import useNewInstance from '../../../functions/state/newInstance';
import steps from '../../../functions/instances/addInstanceSteps';

import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
import Loader from '../../shared/Loader';

import InstanceTypeForm from './Type';
import CloudProviderForm from './ProviderCloud';
import CloudMetadataForm from './MetaCloud';
import LocalMetadataForm from './MetaLocal';
import LocalInstanceForm from './DetailsLocal';
import CloudInstanceForm from './DetailsCloud';
import CustomerPaymentForm from './Payment';
import ConfirmOrderForm from './Confirm';
import OrderStatus from './Status';
import getPrepaidSubscriptions from '../../../functions/api/lms/getPrepaidSubscriptions';
import getUser from '../../../functions/api/lms/getUser';
import VisitCard from '../../shared/VisitCard';

function NewInstanceIndex() {
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);
  const stripe_id = useStoreState(appState, (s) => s.customer?.stripe_id);
  const badCard = useStoreState(appState, (s) => s.customer?.current_payment_status?.status === 'invoice.payment_failed');
  const { purchaseStep = 'type', customer_id } = useParams();
  const theme = useStoreState(appState, (s) => s.theme);
  const [, setNewInstance] = useNewInstance({});

  const closeAndResetModal = useCallback(() => {
    if (purchaseStep !== 'status') {
      setNewInstance({});
      setTimeout(() => history.push(`/o/${customer_id}/instances`), 10);
    }
  }, [customer_id, history, purchaseStep, setNewInstance]);

  const finishOrder = useCallback(() => {
    setNewInstance({});
    setTimeout(() => history.push(`/o/${customer_id}/instances`), 10);
  }, [customer_id, history, setNewInstance]);

  const refreshSubscriptions = useCallback(() => {
    if (auth && customer_id && stripe_id) {
      getPrepaidSubscriptions({ auth, customer_id, stripe_id });
    }
  }, [auth, customer_id, stripe_id]);

  useEffect(() => {
    refreshSubscriptions();
    getUser(auth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return auth.email_bounced ? (
    <Modal id="new-instance-modal" isOpen className={theme} centered fade={false}>
      <ModalBody>
        <Card>
          <CardBody>
            <div className="p-4 pb-0 text-center">
              <b>Unable to Create New Instance</b>
              <br />
              <br />
              Your email address seems to be unreachable. Please update it to ensure billing, upgrade, and other critical system announcements reach you.
            </div>
            <Row>
              <Col sm="6">
                <Button id="cancelNewInstance" onClick={() => history.push(`/o/${customer_id}/instances`)} title="Cancel New Org" block className="mt-2" color="grey">
                  Cancel
                </Button>
              </Col>
              <Col sm="6">
                <Button id="updateEmail" onClick={() => history.push('/profile')} title="Update My Email" block className="mt-2" color="danger">
                  Update My Email
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  ) : badCard ? (
    <Modal id="new-instance-modal" isOpen className={theme} centered fade={false}>
      <ModalBody>
        <Card>
          <CardBody>
            <div className="p-4 pb-0 text-center">
              <b>The Credit Card On File Has An Issue</b>
              <br />
              <br />
              Please update it to proceed, as well as to ensure uninterrupted service for this organization&apos;s existing instances.
            </div>
            <Row>
              <Col sm="6">
                <Button id="cancelNewInstance" onClick={() => history.push(`/o/${customer_id}/instances`)} title="Cancel New Org" block className="mt-2" color="grey">
                  Cancel
                </Button>
              </Col>
              <Col sm="6">
                <VisitCard label="Update Credit Card" onClick={() => history.push(`/o/${customer_id}/billing?returnURL=/o/${customer_id}/instances/new`)} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  ) : (
    <Modal id="new-instance-modal" size={purchaseStep === 'type' ? 'lg' : ''} isOpen className={theme} centered fade={false}>
      {purchaseStep !== 'status' && <ModalHeader toggle={closeAndResetModal}>{steps[purchaseStep]?.label}</ModalHeader>}
      <ModalBody className="position-relative">
        <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id })} FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Loader header=" " spinner />}>
            {purchaseStep === 'type' ? (
              <InstanceTypeForm />
            ) : purchaseStep === 'provider_cloud' ? (
              <CloudProviderForm />
            ) : purchaseStep === 'meta_local' ? (
              <LocalMetadataForm />
            ) : purchaseStep === 'meta_cloud' ? (
              <CloudMetadataForm />
            ) : purchaseStep === 'details_local' ? (
              <LocalInstanceForm />
            ) : purchaseStep === 'details_cloud' ? (
              <CloudInstanceForm />
            ) : purchaseStep === 'payment' ? (
              <CustomerPaymentForm />
            ) : purchaseStep === 'confirm' ? (
              <ConfirmOrderForm />
            ) : purchaseStep === 'status' ? (
              <OrderStatus closeAndResetModal={finishOrder} />
            ) : null}
          </Suspense>
        </ErrorBoundary>
      </ModalBody>
    </Modal>
  );
}

export default NewInstanceIndex;
