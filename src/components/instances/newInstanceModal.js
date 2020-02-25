import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Loader } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import useLMS from '../../stores/lmsData';
import defaultLMSData from '../../util/state/defaultLMSData';
import getInstancePrice from '../../util/stripe/getInstancePrice';
import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';
import customerHasChargeableCard from '../../util/stripe/customerHasChargeableCard';
import getCustomer from '../../api/lms/getCustomer';
import addInstance from '../../api/lms/addInstance';

import LocalInstanceForm from './localInstanceForm';
import CloudInstanceForm from './cloudInstanceForm';
import InstanceTypeForm from './instanceTypeForm';
import CustomerPaymentForm from './customerPaymentForm';
import ConfirmOrderForm from './confirmOrderForm';

export default ({ setShowForm }) => {
  const [lmsData, setLMSData] = useLMS(defaultLMSData);
  const [products, setProducts] = useState(false);
  const [regions, setRegions] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState('Select Instance Type');
  const [instanceType, setInstanceType] = useState(false);
  const [instancePrice, setInstancePrice] = useState(false);
  const [instanceDetails, setInstanceDetails] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const hasCard = customerHasChargeableCard(lmsData.customer);
  const needsCard = instancePrice && !hasCard;
  const instanceSpecs = products && products.raw.find((t) => t.stripe_product_id === instanceDetails.stripe_product_id);

  useAsyncEffect(async () => {
    const newProducts = await getProducts({ auth: lmsData.auth });
    setProducts(newProducts);
    const newRegions = await getRegions({ auth: lmsData.auth });
    setRegions(newRegions);
    const customer = await getCustomer({ auth: lmsData.auth });
    setLMSData({ ...lmsData, customer });
  }, []);

  useAsyncEffect(() => {
    if (instanceType) setPurchaseStep('Instance Details');
  }, [instanceType]);

  useAsyncEffect(() => {
    if (instanceDetails) {
      const selectedInstancePrice = getInstancePrice({ products: products.raw, instanceDetails });
      setInstancePrice(selectedInstancePrice);
      if (selectedInstancePrice && !hasCard) {
        // this costs money, so check if they have a payment form
        setPurchaseStep('Payment Details');
      } else {
        setPurchaseStep('Confirm Instance Details');
      }
    }
  }, [instanceDetails]);

  useAsyncEffect(() => {
    if (paymentInfo) setPurchaseStep('Confirm Instance Details');
  }, [paymentInfo]);

  useAsyncEffect(async () => {
    if (confirmed) {
      await addInstance({ auth: lmsData.auth, payload: { ...instanceDetails, customer_id: lmsData.customer.customer_id } });
      setShowForm(false);
    }
  }, [confirmed]);

  return (
    <Modal id="new-instance-modal" size={purchaseStep === 'Select Instance Type' ? 'lg' : ''} isOpen toggle={() => setShowForm(false)}>
      <ModalHeader toggle={() => setShowForm(false)}>
        {purchaseStep}
      </ModalHeader>
      <ModalBody>
        {!products ? (
          <Loader />
        ) : purchaseStep === 'Select Instance Type' ? (
          <InstanceTypeForm
            setInstanceType={setInstanceType}
          />
        ) : purchaseStep === 'Instance Details' && instanceType === 'local' ? (
          <LocalInstanceForm
            products={products.local}
            setInstanceDetails={setInstanceDetails}
            needsCard={needsCard}
          />
        ) : purchaseStep === 'Instance Details' && instanceType === 'cloud' ? (
          <CloudInstanceForm
            products={products.cloud}
            regions={regions}
            setInstanceDetails={setInstanceDetails}
            needsCard={needsCard}
          />
        ) : purchaseStep === 'Payment Details' ? (
          <CustomerPaymentForm
            instancePrice={instancePrice}
            instanceInterval={instanceType === 'local' ? 'year' : 'month'}
            setPaymentInfo={setPaymentInfo}
          />
        ) : purchaseStep === 'Confirm Instance Details' ? (
          <ConfirmOrderForm
            instancePrice={instancePrice}
            instanceSpecs={instanceSpecs}
            instanceDetails={{ ...instanceDetails, customer_id: lmsData.customer.customer_id }}
            setConfirmed={setConfirmed}
          />
        ) : null}
      </ModalBody>
    </Modal>
  );
};
