import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ButtonGroup } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import useLMS from '../../stores/lmsData';
import defaultLMSData from '../../util/defaultLMSData';
import queryLMS from '../../util/queryLMS';
import LocalInstanceForm from './localInstanceForm';
import CloudInstanceForm from './cloudInstanceForm';

export default ({ showForm, setShowForm }) => {
  const [lmsData] = useLMS(defaultLMSData);
  const [instanceType, setInstanceType] = useState('cloud');
  const [products, setProducts] = useState(false);
  const [regions, setRegions] = useState(false);

  useAsyncEffect(async () => {
    if (showForm) {
      const newProducts = await queryLMS({
        endpoint: 'getProducts',
        method: 'POST',
        auth: lmsData.auth,
      });
      setProducts(newProducts);
      const newRegions = await queryLMS({
        endpoint: 'getRegions',
        method: 'POST',
        auth: lmsData.auth,
      });
      setRegions(newRegions);
    }
  }, [showForm]);

  return (
    <Modal id="new-instance-modal" isOpen={showForm} toggle={() => setShowForm(false)}>
      <ModalHeader toggle={() => setShowForm(false)}>
        Add New Instance
      </ModalHeader>
      <ModalBody>
        <ButtonGroup>
          <Button color="purple" outline={instanceType !== 'cloud'} onClick={() => setInstanceType('cloud')}>HarperDB Cloud Instance</Button>
          <Button color="purple" outline={instanceType !== 'local'} onClick={() => setInstanceType('local')}>Add New Local Instance</Button>
        </ButtonGroup>

        {products && regions && instanceType === 'local' ? (
          <LocalInstanceForm
            instanceType={instanceType}
            products={products.map((p) => ({ label: `${p.instance_ram}GB RAM | ${p.instance_disk_space_gigs}GB Disk Space | $${p.local_price_annual}/year`, value: p.stripe_product_id }))}
            setShowForm={setShowForm}
          />
        ) : products && regions ? (
          <CloudInstanceForm
            instanceType={instanceType}
            products={products.map((p) => ({ label: `${p.instance_ram}GB RAM | ${p.instance_disk_space_gigs}GB Disk Space | $${p.cloud_price_monthly}/month`, value: p.stripe_product_id }))}
            regions={regions}
            setShowForm={setShowForm}
          />
        ) : null}
      </ModalBody>
    </Modal>
  );
};
