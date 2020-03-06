import React from 'react';
import { Modal, ModalHeader, ModalBody, Loader } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import steps from '../../../util/addInstanceSteps';

import InstanceTypeForm from './type';
import CloudMetadataForm from './meta_cloud';
import LocalMetadataForm from './meta_local';
import LocalInstanceForm from './details_local';
import CloudInstanceForm from './details_cloud';
import CustomerPaymentForm from './payment';
import ConfirmOrderForm from './confirm';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';
import useNewInstance from '../../../state/stores/newInstance';
import defaultNewInstanceData from '../../../state/defaults/defaultNewInstanceData';
import useAsyncEffect from 'use-async-effect';

export default () => {
  const history = useHistory();
  const { purchaseStep } = useParams();
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [appData] = useApp(defaultAppData);
  const [newInstance, setNewInstance] = useNewInstance(defaultNewInstanceData);
  const hasCard = customerHasChargeableCard(appData.customer);

  const closeAndResetModal = () => {
    console.log('closing modal');
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
            newInstance={newInstance}
            setNewInstance={setNewInstance}
          />
        ) : purchaseStep === 'details_cloud' ? (
          <CloudInstanceForm
            products={appData.products.cloudCompute}
            storage={appData.products.cloudStorage}
            regions={appData.regions}
            hasCard={hasCard}
            newInstance={newInstance}
            setNewInstance={setNewInstance}
          />
        ) : purchaseStep === 'payment' ? (
          <CustomerPaymentForm
            lmsAuth={lmsAuth}
            hasCard={hasCard}
            newInstance={newInstance}
            computeProduct={appData.products[newInstance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === newInstance.stripe_plan_id)}
            storageProduct={newInstance.is_local ? { price: 'FREE' } : appData.products.cloudStorage.find((p) => p.value === newInstance.data_volume_size)}
          />
        ) : purchaseStep === 'confirm' ? (
          <ConfirmOrderForm
            lmsAuth={lmsAuth}
            newInstance={newInstance}
            computeProduct={appData.products[newInstance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === newInstance.stripe_plan_id)}
            storageProduct={newInstance.is_local ? { price: 'FREE' } : appData.products.cloudStorage.find((p) => p.value === newInstance.data_volume_size)}
            closeAndResetModal={closeAndResetModal}
          />
        ) : null}
      </ModalBody>
    </Modal>
  );
};
