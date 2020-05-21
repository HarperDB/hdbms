import React from 'react';
import { Modal, ModalHeader, ModalBody, Loader } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';
import useNewInstance from '../../../state/newInstance';
import themeState from '../../../state/themeState';

import config from '../../../../config';

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
  const [darkTheme] = themeState(false);
  const { products, regions, instanceNames, instanceURLs, canAddFreeCloudInstance, hasCard, stripeCoupons, customer_id, subdomain } = useStoreState(appState, (s) => ({
    products: s.products,
    regions: s.regions,
    instanceNames: s.instances.map((i) => i.instance_name),
    instanceURLs: s.instances.map((i) => i.url),
    canAddFreeCloudInstance: config.free_cloud_instance_limit > s.instances.filter((i) => !i.is_local && !i.compute.price).length,
    hasCard: s.hasCard,
    stripeCoupons: s.customer.stripe_coupons,
    customer_id: s.customer?.customer_id,
    subdomain: s.customer?.subdomain,
  }));
  const history = useHistory();
  const { purchaseStep = 'type' } = useParams();
  const [newInstance, setNewInstance] = useNewInstance({});
  const isLocal = newInstance.is_local;

  const closeAndResetModal = () => {
    if (purchaseStep !== 'status') {
      setNewInstance({});
      setTimeout(() => history.push(`/${customer_id}/instances`), 100);
    }
  };

  const finishOrder = () => {
    setNewInstance({});
    setTimeout(() => history.push(`/${customer_id}/instances`), 100);
  };

  return (
    <Modal id="new-instance-modal" size={purchaseStep === 'type' ? 'lg' : ''} isOpen className={darkTheme ? 'dark' : ''}>
      {purchaseStep !== 'status' && <ModalHeader toggle={closeAndResetModal}>{steps[purchaseStep]?.label}</ModalHeader>}
      <ModalBody>
        {!products ? (
          <Loader />
        ) : purchaseStep === 'type' ? (
          <InstanceTypeForm customerId={customer_id} />
        ) : purchaseStep === 'meta_local' ? (
          <LocalMetadataForm instanceNames={instanceNames} instanceURLs={instanceURLs} customerId={customer_id} />
        ) : purchaseStep === 'meta_cloud' ? (
          <CloudMetadataForm instanceNames={instanceNames} customerId={customer_id} customerSubdomain={subdomain} />
        ) : purchaseStep === 'details_local' ? (
          <LocalInstanceForm products={products.localCompute} hasCard={hasCard} customerId={customer_id} />
        ) : purchaseStep === 'details_cloud' ? (
          <CloudInstanceForm
            products={products.cloudCompute}
            storage={products.cloudStorage}
            regions={regions}
            hasCard={hasCard}
            customerId={customer_id}
            canAddFreeCloudInstance={canAddFreeCloudInstance}
            freeCloudInstanceLimit={config.free_cloud_instance_limit}
          />
        ) : purchaseStep === 'payment' ? (
          <CustomerPaymentForm
            hasCard={hasCard}
            isLocal={isLocal}
            customerId={customer_id}
            computeProduct={products[isLocal ? 'localCompute' : 'cloudCompute'].find((p) => p.value === newInstance.stripe_plan_id)}
            storageProduct={isLocal ? { price: 0 } : products.cloudStorage.find((p) => p.value === newInstance.data_volume_size)}
          />
        ) : purchaseStep === 'confirm' ? (
          <ConfirmOrderForm
            customerId={customer_id}
            computeProduct={products[isLocal ? 'localCompute' : 'cloudCompute'].find((p) => p.value === newInstance.stripe_plan_id)}
            storageProduct={isLocal ? { price: 0 } : products.cloudStorage.find((p) => p.value === newInstance.data_volume_size)}
            customerCoupon={stripeCoupons}
            customerSubdomain={subdomain}
          />
        ) : purchaseStep === 'status' ? (
          <OrderStatus closeAndResetModal={finishOrder} />
        ) : null}
      </ModalBody>
    </Modal>
  );
};
