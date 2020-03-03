import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Loader } from '@nio/ui-kit';

import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import steps from '../../../util/addInstanceSteps';

import InstanceTypeForm from './type';
import InstanceMetadataForm from './meta';
import LocalInstanceForm from './local';
import CloudInstanceForm from './cloud';
import CustomerPaymentForm from './payment';
import ConfirmOrderForm from './confirm';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';

export default ({ setShowForm }) => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [appData] = useApp(defaultAppData);
  const [purchaseStep, setPurchaseStep] = useState('type');
  const [newInstance, setNewInstance] = useState({});
  const hasCard = customerHasChargeableCard(appData.customer);

  return (
    <Modal id="new-instance-modal" size={purchaseStep === 'type' ? 'lg' : ''} isOpen toggle={() => setShowForm(false)}>
      <ModalHeader toggle={() => setShowForm(false)}>
        {steps[purchaseStep].label}
      </ModalHeader>
      <ModalBody>
        {!appData.products ? (
          <Loader />
        ) : purchaseStep === 'type' ? (
          <InstanceTypeForm
            newInstance={newInstance}
            setNewInstance={setNewInstance}
            setPurchaseStep={setPurchaseStep}
          />
        ) : purchaseStep === 'meta' ? (
          <InstanceMetadataForm
            newInstance={newInstance}
            setNewInstance={setNewInstance}
            setPurchaseStep={setPurchaseStep}
          />
        ) : purchaseStep === 'details_local' ? (
          <LocalInstanceForm
            products={appData.products.localCompute}
            hasCard={hasCard}
            newInstance={newInstance}
            setNewInstance={setNewInstance}
            setPurchaseStep={setPurchaseStep}
          />
        ) : purchaseStep === 'details_cloud' ? (
          <CloudInstanceForm
            products={appData.products.cloudCompute}
            storage={appData.products.cloudStorage}
            regions={appData.regions}
            hasCard={hasCard}
            newInstance={newInstance}
            setNewInstance={setNewInstance}
            setPurchaseStep={setPurchaseStep}
          />
        ) : purchaseStep === 'payment' ? (
          <CustomerPaymentForm
            lmsAuth={lmsAuth}
            hasCard={hasCard}
            newInstance={newInstance}
            computeProduct={appData.products[newInstance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === newInstance.stripe_plan_id)}
            storageProduct={newInstance.is_local ? { price: 'FREE' } : appData.products.cloudStorage.find((p) => p.value === newInstance.storage_qty_gb)}
            setPurchaseStep={setPurchaseStep}
          />
        ) : purchaseStep === 'confirm' ? (
          <ConfirmOrderForm
            lmsAuth={lmsAuth}
            newInstance={newInstance}
            computeProduct={appData.products[newInstance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === newInstance.stripe_plan_id)}
            storageProduct={newInstance.is_local ? { price: 'FREE' } : appData.products.cloudStorage.find((p) => p.value === newInstance.storage_qty_gb)}
            setShowForm={setShowForm}
            setPurchaseStep={setPurchaseStep}
          />
        ) : null}
      </ModalBody>
    </Modal>
  );
};
