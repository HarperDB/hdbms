import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Loader } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import useLMS from '../../../state/stores/lmsData';
import defaultLMSData from '../../../state/defaults/defaultLMSData';
import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import getCustomer from '../../../api/lms/getCustomer';

import steps from '../../../util/addInstanceSteps';
import InstanceTypeForm from './type';
import InstanceMetadataForm from './meta';
import LocalInstanceForm from './local';
import CloudInstanceForm from './cloud';
import CustomerPaymentForm from './payment';
import ConfirmOrderForm from './confirm';

export default ({ setShowForm }) => {
  const [lmsData, setLMSData] = useLMS(defaultLMSData);
  const [purchaseStep, setPurchaseStep] = useState('type');
  const [newInstance, setNewInstance] = useState({});
  const hasCard = customerHasChargeableCard(lmsData.customer);

  useAsyncEffect(async () => {
    const customer = await getCustomer({ auth: lmsData.auth });
    setLMSData({ ...lmsData, customer });
  }, []);

  return (
    <Modal id="new-instance-modal" size={purchaseStep === 'type' ? 'lg' : ''} isOpen toggle={() => setShowForm(false)}>
      <ModalHeader toggle={() => setShowForm(false)}>
        {steps[purchaseStep].label}
      </ModalHeader>
      <ModalBody>
        {!lmsData.products ? (
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
            products={lmsData.products.localCompute}
            hasCard={hasCard}
            newInstance={newInstance}
            setNewInstance={setNewInstance}
            setPurchaseStep={setPurchaseStep}
          />
        ) : purchaseStep === 'details_cloud' ? (
          <CloudInstanceForm
            products={lmsData.products.cloudCompute}
            storage={lmsData.products.cloudStorage}
            regions={lmsData.regions}
            hasCard={hasCard}
            newInstance={newInstance}
            setNewInstance={setNewInstance}
            setPurchaseStep={setPurchaseStep}
          />
        ) : purchaseStep === 'payment' ? (
          <CustomerPaymentForm
            hasCard={hasCard}
            newInstance={newInstance}
            computeProduct={lmsData.products[newInstance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === newInstance.stripe_plan_id)}
            storageProduct={newInstance.is_local ? { price: 'FREE' } : lmsData.products.cloudStorage.find((p) => p.value === newInstance.storage_qty_gb)}
            setPurchaseStep={setPurchaseStep}
          />
        ) : purchaseStep === 'confirm' ? (
          <ConfirmOrderForm
            newInstance={newInstance}
            computeProduct={lmsData.products[newInstance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === newInstance.stripe_plan_id)}
            storageProduct={newInstance.is_local ? { price: 'FREE' } : lmsData.products.cloudStorage.find((p) => p.value === newInstance.storage_qty_gb)}
            setShowForm={setShowForm}
            setPurchaseStep={setPurchaseStep}
          />
        ) : null}
      </ModalBody>
    </Modal>
  );
};
