import React from 'react';
import { Modal, ModalHeader, ModalBody, Loader } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';
import useNewInstance from '../../../state/stores/newInstance';
import defaultNewInstanceData from '../../../state/defaults/defaultNewInstanceData';

import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import steps from '../../../util/addInstanceSteps';

import InstanceTypeForm from './type';
import CloudMetadataForm from './meta_cloud';
import LocalMetadataForm from './meta_local';
import LocalInstanceForm from './details_local';
import CloudInstanceForm from './details_cloud';
import CustomerPaymentForm from './payment';
import ConfirmOrderForm from './confirm';
import OrderStatus from './status';

const getComputeProduct = ({ isLocal, products, stripePlan }) => products[isLocal ? 'localCompute' : 'cloudCompute'].find((p) => p.value === stripePlan);
const getStorageProduct = ({ isLocal, products, dataVolumeSize }) => isLocal ? { price: 'FREE' } : products.cloudStorage.find((p) => p.value === dataVolumeSize);

export default () => {
  const history = useHistory();
  const { purchaseStep } = useParams();
  const [appData] = useApp(defaultAppData);
  const [newInstance, setNewInstance] = useNewInstance(defaultNewInstanceData);

  const isLocal = newInstance.is_local;
  const hasCard = customerHasChargeableCard(appData.customer);

  const closeAndResetModal = () => {
    setNewInstance(defaultNewInstanceData);
    setTimeout(() => history.push('/instances'), 100);
  };

  useAsyncEffect(() => setNewInstance({ ...newInstance, customer_id: appData.customer.customer_id }), [purchaseStep]);

  return (
    <Modal id="new-instance-modal" size={purchaseStep === 'type' ? 'lg' : ''} isOpen toggle={closeAndResetModal}>
      <ModalHeader toggle={closeAndResetModal}>
        {steps[purchaseStep].label}
      </ModalHeader>
      <ModalBody>
        {!appData.products ? (
          <Loader />
        ) : purchaseStep === 'type' ? (
          <InstanceTypeForm />
        ) : purchaseStep === 'meta_local' ? (
          <LocalMetadataForm />
        ) : purchaseStep === 'meta_cloud' ? (
          <CloudMetadataForm />
        ) : purchaseStep === 'details_local' ? (
          <LocalInstanceForm
            products={appData.products.localCompute}
            hasCard={hasCard}
          />
        ) : purchaseStep === 'details_cloud' ? (
          <CloudInstanceForm
            products={appData.products.cloudCompute}
            storage={appData.products.cloudStorage}
            regions={appData.regions}
            hasCard={hasCard}
          />
        ) : purchaseStep === 'payment' ? (
          <CustomerPaymentForm
            hasCard={hasCard}
            isLocal={isLocal}
            computeProduct={appData.products[isLocal ? 'localCompute' : 'cloudCompute'].find((p) => p.value === newInstance.stripe_plan_id)}
            storageProduct={isLocal ? { price: 'FREE' } : appData.products.cloudStorage.find((p) => p.value === newInstance.data_volume_size)}
          />
        ) : purchaseStep === 'confirm' ? (
          <ConfirmOrderForm
            computeProduct={appData.products[isLocal ? 'localCompute' : 'cloudCompute'].find((p) => p.value === newInstance.stripe_plan_id)}
            storageProduct={isLocal ? { price: 'FREE' } : appData.products.cloudStorage.find((p) => p.value === newInstance.data_volume_size)}
          />
        ) : purchaseStep === 'status' ? (
          <OrderStatus
            closeAndResetModal={closeAndResetModal}
          />
        ) : null}
      </ModalBody>
    </Modal>
  );
};
