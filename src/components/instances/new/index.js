import React from 'react';
import { Modal, ModalHeader, ModalBody, Loader } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';
import useNewInstance from '../../../state/newInstance';
import steps from '../../../methods/instances/addInstanceSteps';

import InstanceTypeForm from './type';
import CloudMetadataForm from './metaCloud';
import LocalMetadataForm from './metaLocal';
import LocalInstanceForm from './detailsLocal';
import CloudInstanceForm from './detailsCloud';
import CustomerPaymentForm from './payment';
import ConfirmOrderForm from './confirm';
import OrderStatus from './status';

export default () => {
  const history = useHistory();
  const { purchaseStep = 'type', customer_id } = useParams();
  const darkTheme = useStoreState(appState, (s) => s.darkTheme);
  const products = useStoreState(appState, (s) => s.products);
  const [, setNewInstance] = useNewInstance({});

  const closeAndResetModal = () => {
    if (purchaseStep !== 'status') {
      setNewInstance({});
      setTimeout(() => history.push(`/o/${customer_id}/instances`), 100);
    }
  };

  const finishOrder = () => {
    setNewInstance({});
    setTimeout(() => history.push(`/o/${customer_id}/instances`), 100);
  };

  return (
    <Modal id="new-instance-modal" size={purchaseStep === 'type' ? 'lg' : ''} isOpen className={darkTheme ? 'dark' : ''}>
      {purchaseStep !== 'status' && <ModalHeader toggle={closeAndResetModal}>{steps[purchaseStep]?.label}</ModalHeader>}
      <ModalBody>
        {!products ? (
          <Loader />
        ) : purchaseStep === 'type' ? (
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
      </ModalBody>
    </Modal>
  );
};
