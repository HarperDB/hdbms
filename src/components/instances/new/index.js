import React, { lazy, Suspense } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../state/appState';
import useNewInstance from '../../../state/newInstance';
import steps from '../../../methods/instances/addInstanceSteps';

import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';
import Loader from '../../shared/loader';

const InstanceTypeForm = lazy(() => import('./type'));
const CloudMetadataForm = lazy(() => import('./metaCloud'));
const LocalMetadataForm = lazy(() => import('./metaLocal'));
const LocalInstanceForm = lazy(() => import('./detailsLocal'));
const CloudInstanceForm = lazy(() => import('./detailsCloud'));
const CustomerPaymentForm = lazy(() => import('./payment'));
const ConfirmOrderForm = lazy(() => import('./confirm'));
const OrderStatus = lazy(() => import('./status'));

export default () => {
  const history = useHistory();
  const { purchaseStep = 'type', customer_id } = useParams();
  const darkTheme = useStoreState(appState, (s) => s.darkTheme);
  const [, setNewInstance] = useNewInstance({});

  const closeAndResetModal = () => {
    if (purchaseStep !== 'status') {
      setNewInstance({});
      setTimeout(() => history.push(`/o/${customer_id}/instances`), 10);
    }
  };

  const finishOrder = () => {
    setNewInstance({});
    setTimeout(() => history.push(`/o/${customer_id}/instances`), 10);
  };

  return (
    <Modal id="new-instance-modal" size={purchaseStep === 'type' ? 'lg' : ''} isOpen className={darkTheme ? 'dark' : ''}>
      {purchaseStep !== 'status' && <ModalHeader toggle={closeAndResetModal}>{steps[purchaseStep]?.label}</ModalHeader>}
      <ModalBody className="position-relative">
        <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id })} FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Loader header=" " spinner />}>
            {purchaseStep === 'type' ? (
              <InstanceTypeForm />
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
};
