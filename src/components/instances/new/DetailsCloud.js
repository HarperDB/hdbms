import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import appState from '../../../functions/state/appState';
import useNewInstance from '../../../functions/state/newInstance';
import ContentContainer from '../../shared/ContentContainer';
import RadioCheckbox from '../../shared/RadioCheckbox';
import DetailsSubheader from './DetailsSubheader';
import config from '../../../config';
function DetailsCloud() {
  const navigate = useNavigate();
  const {
    customerId
  } = useParams();
  const {
    userId,
    orgs
  } = useStoreState(appState, s => s.auth);
  const [newInstance, setNewInstance] = useNewInstance({});
  const isUnpaid = useStoreState(appState, s => s.customer.isUnpaid || newInstance.cloudProvider === 'akamai');
  const unusedCompute = useStoreState(appState, s => s.subscriptions?.cloudCompute?.filter(p => p.value.active && p.value.computeQuantityAvailable) || []);
  const unusedStorage = useStoreState(appState, s => s.subscriptions?.cloudStorage?.filter(p => p.value.active && p.value.storageQuantityAvailable >= p.value.dataVolumeSize) || []);
  const products = useStoreState(appState, s => newInstance.cloudProvider === 'lumen' ? s.products.lumenCompute?.filter(p => p.value.active) || [] : newInstance.cloudProvider === 'verizon' ? s.products.wavelengthCompute?.filter(p => p.value.active) || [] : newInstance.cloudProvider === 'akamai' ? s.products.akamaiCompute?.filter(p => p.value.active) || [] : newInstance.showPrepaidCompute ? unusedCompute : s.products.cloudCompute.filter(p => p.value.active), [newInstance.showPrepaidCompute]);
  const storage = useStoreState(appState, s => newInstance.cloudProvider === 'lumen' ? false : newInstance.showPrepaidStorage ? unusedStorage : s.products.cloudStorage.filter(p => p.value.active), [newInstance.showPrepaidStorage]);
  const regions = useStoreState(appState, s => newInstance.cloudProvider === 'lumen' ? [] : newInstance.cloudProvider === 'verizon' ? s.wavelengthRegions : newInstance.cloudProvider === 'akamai' ? s.akamaiRegions : s.regions);
  const hasCard = useStoreState(appState, s => s.hasCard);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({
    ...storage[0]?.value,
    ...products[0]?.value,
    ...newInstance
  });
  const isFree = !formData.computePrice && !formData.computeSubscriptionId && !formData.storagePrice && !formData.storageSubscriptionId;
  const needsCard = products && storage && !hasCard && !isFree && !isUnpaid;
  const totalFreeCloudInstances = orgs.filter(o => userId === o.ownerUserId).reduce((a, b) => a + b.freeCloudInstanceCount, 0);
  const freeCloudInstanceLimit = config.freeCloudInstanceLimit;
  const canAddFreeCloudInstance = totalFreeCloudInstances < freeCloudInstanceLimit;
  const canProceedToNextPage = formData.stripePlanId && formData.instanceRegion && (newInstance.cloudProvider === 'lumen' || formData.stripeStoragePlanId);
  useAsyncEffect(() => {
    const {
      submitted
    } = formState;
    const {
      stripePlanId,
      stripeStoragePlanId,
      instanceRegion,
      instanceType,
      dataVolumeSize
    } = formData;
    if (submitted) {
      if (isFree && freeCloudInstanceLimit && !canAddFreeCloudInstance) {
        setFormState({
          error: `You are limited to ${freeCloudInstanceLimit} free cloud instance${freeCloudInstanceLimit !== 1 ? 's' : ''} across organizations you own`
        });
      } else if (stripePlanId && stripeStoragePlanId && instanceRegion && instanceType && dataVolumeSize) {
        setNewInstance({
          ...newInstance,
          ...formData
        });
        setTimeout(() => navigate(needsCard ? `/o/${customerId}/instances/new/payment` : `/o/${customerId}/instances/new/confirm`), 0);
      } else {
        setFormState({
          error: 'All fields must be filled out.'
        });
      }
    }
  }, [formState]);
  useAsyncEffect(() => setFormState({}), [formData]);
  return <>
      <Card id="cloudInstanceSpecs">
        <CardBody>
          <ContentContainer header="Instance RAM" subheader={<DetailsSubheader hasPrepaid={unusedCompute.length} newInstance={newInstance} setNewInstance={setNewInstance} toggleValue="showPrepaidCompute" />} maxHeight="120px">
            {!products ? <div className="text-center">
                <i className="fa fa-spinner fa-spin text-purple mt-5" />
              </div> : products.length ? <RadioCheckbox id="stripe_plan_id" className="radio-button" type="radio" required onChange={value => setFormData({
            ...formData,
            ...value
          })} options={products} defaultValue={newInstance.stripePlanId ? products.find(p => p.value.stripePlanId === newInstance.stripePlanId) : products[0]} /> : <div className="text-center my-4 py-4">No products available at this time</div>}
          </ContentContainer>
          {storage && <ContentContainer header="Storage Size" subheader={<DetailsSubheader hasPrepaid={unusedStorage.length} newInstance={newInstance} setNewInstance={setNewInstance} toggleValue="showPrepaidStorage" />} maxHeight="120px">
              <RadioCheckbox id="data_volume_size" className="radio-button" type="radio" required onChange={value => setFormData({
            ...formData,
            ...value
          })} options={storage} defaultValue={newInstance.dataVolumeSize ? storage.find(p => p.value.dataVolumeSize === newInstance.dataVolumeSize) : storage[0]} />
            </ContentContainer>}
          <ContentContainer header="Instance Region" subheader="scroll for more" maxHeight="120px">
            {!regions ? <div className="text-center">
                <i className="fa fa-spinner fa-spin text-purple mt-5" />
              </div> : regions.length ? <RadioCheckbox id="instance_region" className="radio-button" type="radio" required onChange={value => setFormData({
            ...formData,
            instanceRegion: value
          })} options={regions} value={formData.instanceRegion} defaultValue={newInstance.instanceRegion ? regions.find(p => p.value === newInstance.instanceRegion) : regions[0]} /> : <div className="text-center my-4 py-4">No regions available at this time</div>}
          </ContentContainer>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button id="backToBasicInfo" onClick={() => navigate(`/o/${customerId}/instances/new/meta_cloud`)} title="Back to Basic Info" block className="mt-3" color="purple">
            <i className="fa fa-chevron-circle-left me-2" />
            Basic Info
          </Button>
        </Col>
        <Col sm="6">
          <Button id={needsCard ? 'addPaymentMethod' : 'confirmInstanceDetails'} onClick={() => setFormState({
          submitted: true
        })} title={needsCard ? 'Add Payment Method' : 'Confirm Instance Details'} block className="mt-3" color="purple" disabled={!canProceedToNextPage}>
            {needsCard ? 'Add Payment Method' : 'Confirm Instance Details'}
            <i className="fa fa-chevron-circle-right ms-2" />
          </Button>
        </Col>
      </Row>
      {formState.error && <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>}
    </>;
}
export default DetailsCloud;