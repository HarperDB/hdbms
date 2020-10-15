import React, { Suspense, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../functions/state/appState';
import useNewInstance from '../../../functions/state/newInstance';
import steps from '../../../functions/instances/addInstanceSteps';

import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../functions/api/lms/addError';
import Loader from '../../shared/loader';

import InstanceTypeForm from './type';
import CloudMetadataForm from './metaCloud';
import LocalMetadataForm from './metaLocal';
import LocalInstanceForm from './detailsLocal';
import CloudInstanceForm from './detailsCloud';
import CustomerPaymentForm from './payment';
import ConfirmOrderForm from './confirm';
import OrderStatus from './status';
import getPrepaidSubscriptions from '../../../functions/api/lms/getPrepaidSubscriptions';

export default () => {
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);
  const stripe_id = useStoreState(appState, (s) => s.customer?.stripe_id);
  const { purchaseStep = 'type', customer_id } = useParams();
  const theme = useStoreState(appState, (s) => s.theme);
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

  const refreshSubscriptions = () => {
    if (auth && customer_id && stripe_id) {
      getPrepaidSubscriptions({ auth, customer_id, stripe_id });
    }
  };

  useEffect(refreshSubscriptions, [auth, customer_id, stripe_id]);

  return (
    <Modal id="new-instance-modal" size={purchaseStep === 'type' ? 'lg' : ''} isOpen className={theme}>
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
