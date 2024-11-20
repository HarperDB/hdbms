import React, { Suspense, useEffect, useCallback } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';
import appState from '../../../functions/state/appState';
import useNewInstance from '../../../functions/state/newInstance';
import steps from '../../../functions/instances/addInstanceSteps';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
import Loader from '../../shared/Loader';
import InstanceTypeForm from './Type';
import CloudMetadataForm from './MetaCloud';
import LocalMetadataForm from './MetaLocal';
import LocalInstanceForm from './DetailsLocal';
import CloudInstanceForm from './DetailsCloud';
import CustomerPaymentForm from './Payment';
import ConfirmOrderForm from './Confirm';
import OrderStatus from './Status';
import BadCard from './BadCard';
import getPrepaidSubscriptions from '../../../functions/api/lms/getPrepaidSubscriptions';
import getUser from '../../../functions/api/lms/getUser';
import EmailBounced from './EmailBounced';
function NewInstanceIndex() {
  const navigate = useNavigate();
  const auth = useStoreState(appState, s => s.auth);
  const stripeId = useStoreState(appState, s => s.customer?.stripeId);
  const badCard = useStoreState(appState, s => s.customer?.currentPaymentStatus?.status === 'invoice.payment_failed');
  const {
    purchaseStep = 'type',
    customerId
  } = useParams();
  const theme = useStoreState(appState, s => s.theme);
  const themes = useStoreState(appState, s => s.themes);
  const [, setNewInstance] = useNewInstance({});
  const size = purchaseStep === 'type' && themes.length > 1 ? 'xl' : purchaseStep === 'type' ? 'lg' : '';
  const closeAndResetModal = useCallback(() => {
    if (purchaseStep !== 'status') {
      setNewInstance({});
      setTimeout(() => navigate(`/o/${customerId}/instances`), 10);
    }
  }, [customerId, navigate, purchaseStep, setNewInstance]);
  const finishOrder = useCallback(() => {
    setNewInstance({});
    setTimeout(() => navigate(`/o/${customerId}/instances`), 10);
  }, [customerId, navigate, setNewInstance]);
  const refreshSubscriptions = useCallback(() => {
    if (auth && customerId && stripeId) {
      getPrepaidSubscriptions({
        auth,
        customerId,
        stripeId
      });
    }
  }, [auth, customerId, stripeId]);
  useEffect(() => {
    refreshSubscriptions();
    getUser(auth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Modal id="new-instance-modal" size={size} isOpen className={theme} centered fade={false}>
      {purchaseStep !== 'status' && <ModalHeader toggle={closeAndResetModal}>{steps[purchaseStep]?.label}</ModalHeader>}
      <ModalBody className="position-relative">
        <ErrorBoundary onError={(error, componentStack) => addError({
        error: {
          message: error.message,
          componentStack
        },
        customerId
      })} FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Loader header=" " spinner />}>
            {auth.emailBounced ? <EmailBounced /> : badCard ? <BadCard /> : purchaseStep === 'type' ? <InstanceTypeForm /> : purchaseStep === 'meta_local' ? <LocalMetadataForm /> : purchaseStep === 'meta_cloud' ? <CloudMetadataForm /> : purchaseStep === 'details_local' ? <LocalInstanceForm /> : purchaseStep === 'details_cloud' ? <CloudInstanceForm /> : purchaseStep === 'payment' ? <CustomerPaymentForm /> : purchaseStep === 'confirm' ? <ConfirmOrderForm /> : purchaseStep === 'status' ? <OrderStatus closeAndResetModal={finishOrder} /> : null}
          </Suspense>
        </ErrorBoundary>
      </ModalBody>
    </Modal>;
}
export default NewInstanceIndex;