import React, { useState } from 'react';
import { Button, RadioCheckbox, Card, CardBody, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import useNewInstance from '../../../state/newInstance';
import ContentContainer from '../../shared/contentContainer';
import config from '../../../config';

export default () => {
  const history = useHistory();
  const { customer_id } = useParams();
  const { user_id, orgs } = useStoreState(appState, (s) => s.auth);
  const [newInstance, setNewInstance] = useNewInstance({});
  const unusedProducts = useStoreState(appState, (s) => s.subscriptions?.cloud_compute?.length);
  const unusedStorage = useStoreState(appState, (s) => s.subscriptions?.cloud_storage?.length);
  const products = useStoreState(
    appState,
    (s) => (newInstance.showPrepaidCompute ? s.subscriptions?.cloud_compute || [] : s.products.cloud_compute.filter((p) => p.value.active)),
    [newInstance.showPrepaidCompute]
  );

  const storage = useStoreState(appState, (s) => (newInstance.showPrepaidStorage ? s.subscriptions?.cloud_storage || [] : s.products.cloud_storage.filter((p) => p.value.active)), [
    newInstance.showPrepaidStorage,
  ]);
  const regions = useStoreState(appState, (s) => s.regions);
  const hasCard = useStoreState(appState, (s) => s.hasCard);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ ...storage[0]?.value, ...products[0]?.value, ...newInstance });

  const selectedCompute =
    products &&
    formData.stripe_plan_id &&
    products.find(
      (p) => p.value.stripe_plan_id === formData.stripe_plan_id && (!formData.compute_subscription_id || p.value.storage_subscription_id === formData.compute_subscription_id)
    );
  const computePrice = selectedCompute?.value.compute_price;

  const selectedStorage =
    storage &&
    formData.data_volume_size &&
    storage.find(
      (p) =>
        p.value.data_volume_size === formData.data_volume_size &&
        p.value.stripe_storage_plan_id === formData.stripe_storage_plan_id &&
        (!newInstance.storage_subscription_id || p.value.storage_subscription_id === formData.storage_subscription_id)
    );
  const storagePrice = selectedStorage?.value.storage_price;

  const isFree = !computePrice && !storagePrice && !formData.compute_subscription_id && !formData.storage_subscription_id;
  const needsCard = products && storage && !hasCard && !isFree;
  const totalFreeCloudInstances = orgs.filter((o) => user_id === o.owner_user_id).reduce((a, b) => a + b.free_cloud_instance_count, 0);
  const freeCloudInstanceLimit = config.free_cloud_instance_limit;
  const canAddFreeCloudInstance = totalFreeCloudInstances < freeCloudInstanceLimit;

  const computeSubheader =
    unusedProducts || newInstance.showPrepaidCompute ? (
      <span>
        show prepaid options:{' '}
        <i
          onClick={() => setNewInstance({ ...newInstance, showPrepaidCompute: !newInstance.showPrepaidCompute })}
          className={`fa fa-lg fa-toggle-${newInstance.showPrepaidCompute ? 'on' : 'off'}`}
        />
      </span>
    ) : (
      'scroll for more'
    );
  const storageSubheader =
    unusedStorage || newInstance.showPrepaidStorage ? (
      <span>
        show prepaid options:{' '}
        <i
          onClick={() => setNewInstance({ ...newInstance, showPrepaidStorage: !newInstance.showPrepaidStorage })}
          className={`fa fa-lg fa-toggle-${newInstance.showPrepaidStorage ? 'on' : 'off'}`}
        />
      </span>
    ) : (
      'scroll for more'
    );

  useAsyncEffect(() => {
    const { submitted } = formState;
    const { stripe_plan_id, stripe_storage_plan_id, instance_region, instance_type, data_volume_size } = formData;

    if (submitted) {
      if (isFree && freeCloudInstanceLimit && !canAddFreeCloudInstance) {
        setFormState({ error: `You are limited to ${freeCloudInstanceLimit} free cloud instance${freeCloudInstanceLimit !== 1 ? 's' : ''} across organizations you own` });
      } else if (stripe_plan_id && stripe_storage_plan_id && instance_region && instance_type && data_volume_size) {
        setNewInstance({ ...newInstance, ...formData });
        setTimeout(() => history.push(needsCard ? `/o/${customer_id}/instances/new/payment` : `/o/${customer_id}/instances/new/confirm`), 0);
      } else {
        setFormState({ error: 'All fields must be filled out.' });
      }
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({}), [formData]);

  return (
    <>
      <Card id="cloudInstanceSpecs">
        <CardBody>
          <ContentContainer header="Instance RAM" subheader={computeSubheader} maxHeight="120px" minHeight="120px">
            {products.length ? (
              <RadioCheckbox
                id="stripe_plan_id"
                className="radio-button"
                type="radio"
                required
                onChange={(value) => setFormData({ ...formData, ...value })}
                options={products}
                value={formData.stripe_plan_id}
                defaultValue={selectedCompute || products[0]}
              />
            ) : (
              <div className="text-center">
                <i className="fa fa-spinner fa-spin text-purple mt-5" />
              </div>
            )}
          </ContentContainer>
          <ContentContainer header="Storage Size" subheader={storageSubheader} maxHeight="120px" minHeight="120px">
            {storage.length ? (
              <RadioCheckbox
                id="data_volume_size"
                className="radio-button"
                type="radio"
                required
                onChange={(value) => setFormData({ ...formData, ...value })}
                options={storage}
                value={{
                  data_volume_size: formData.data_volume_size,
                  stripe_storage_plan_id: formData.stripe_storage_plan_id,
                  storage_subscription_id: formData.storage_subscription_id,
                }}
                defaultValue={selectedStorage || storage[0]}
              />
            ) : (
              <div className="text-center">
                <i className="fa fa-spinner fa-spin text-purple mt-5" />
              </div>
            )}
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
          <Button onClick={() => history.push(`/o/${customer_id}/instances/new/meta_cloud`)} title="Back to Basic Info" block className="mt-3" color="purple">
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
