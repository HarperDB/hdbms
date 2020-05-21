import React, { useState } from 'react';
import { Button, RadioCheckbox, Card, CardBody, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import useNewInstance from '../../../state/newInstance';
import ContentContainer from '../../shared/contentContainer';

export default ({ products, storage, regions, hasCard, canAddFreeCloudInstance, freeCloudInstanceLimit, customerId }) => {
  const history = useHistory();
  const [newInstance, setNewInstance] = useNewInstance({});
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({
    data_volume_size: newInstance.data_volume_size || storage[0].value,
    stripe_plan_id: newInstance.stripe_plan_id || products[0].value,
    instance_region: newInstance.instance_region || regions[0].value,
    instance_type: false,
  });
  const selectedProduct = products && formData.stripe_plan_id && products.find((p) => p.value === formData.stripe_plan_id);
  const computePrice = selectedProduct?.price;
  const instanceType = selectedProduct?.instance_type;
  const storagePrice = storage && formData.data_volume_size ? storage.find((p) => p.value === formData.data_volume_size)?.price : 'FREE';
  const isFree = !computePrice && !storagePrice;
  const needsCard = products && storage && !hasCard && !isFree;

  useAsyncEffect(() => {
    const { submitted } = formState;
    const { stripe_plan_id, instance_region, data_volume_size } = formData;
    if (submitted) {
      if (isFree && freeCloudInstanceLimit && !canAddFreeCloudInstance) {
        setFormState({ error: `You are limited to ${freeCloudInstanceLimit} free cloud instance${freeCloudInstanceLimit !== 1 ? 's' : ''}` });
      } else if (stripe_plan_id && instance_region && data_volume_size) {
        setNewInstance({ ...newInstance, ...formData, instance_type: instanceType });
        setTimeout(() => history.push(needsCard ? `/${customerId}/instances/new/payment` : `/${customerId}/instances/new/confirm`), 0);
      } else {
        setFormState({ error: 'All fields must be filled out.' });
      }
    }
  }, [formState]);

  return (
    <>
      <Card id="cloudInstanceSpecs">
        <CardBody>
          <ContentContainer header="Instance RAM" subheader="scroll for more" maxHeight="120px">
            <RadioCheckbox
              id="stripe_plan_id"
              className="radio-button"
              type="radio"
              required
              onChange={(value) => setFormData({ ...formData, stripe_plan_id: value })}
              options={products}
              value={formData.stripe_plan_id}
              defaultValue={newInstance.stripe_plan_id ? products.find((p) => p.value === newInstance.stripe_plan_id) : products[0]}
            />
          </ContentContainer>
          <ContentContainer header="Storage Size" subheader="scroll for more" maxHeight="120px">
            <RadioCheckbox
              id="data_volume_size"
              className="radio-button"
              type="radio"
              required
              onChange={(value) => setFormData({ ...formData, data_volume_size: value })}
              options={storage}
              value={formData.data_volume_size}
              defaultValue={newInstance.data_volume_size ? storage.find((p) => p.value === newInstance.data_volume_size) : storage[0]}
            />
          </ContentContainer>
          <ContentContainer header="Instance Region" subheader="scroll for more" maxHeight="120px">
            <RadioCheckbox
              id="instance_region"
              className="radio-button"
              type="radio"
              required
              onChange={(value) => setFormData({ ...formData, instance_region: value })}
              options={regions}
              value={formData.instance_region}
              defaultValue={newInstance.instance_region ? regions.find((p) => p.value === newInstance.instance_region) : regions[0]}
            />
          </ContentContainer>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button onClick={() => history.push(`/${customerId}/instances/new/meta_cloud`)} title="Back to Basic Info" block className="mt-3" color="purple">
            <i className="fa fa-chevron-circle-left mr-2" />
            Basic Info
          </Button>
        </Col>
        <Col sm="6">
          <Button
            id={needsCard ? 'addPaymentMethod' : 'confirmInstanceDetails'}
            onClick={() => setFormState({ submitted: true })}
            title={needsCard ? 'Add Payment Method' : 'Confirm Instance Details'}
            block
            className="mt-3"
            color="purple"
          >
            {needsCard ? 'Add Payment Method' : 'Confirm Instance Details'}
            <i className="fa fa-chevron-circle-right ml-2" />
          </Button>
        </Col>
      </Row>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
};
