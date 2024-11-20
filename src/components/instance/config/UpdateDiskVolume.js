import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import SelectDropdown from 'react-select';
import useAsyncEffect from 'use-async-effect';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import appState from '../../../functions/state/appState';
import instanceState from '../../../functions/state/instanceState';
import config from '../../../config';
import ChangeSummary from './ChangeSummary';
import BadCard from '../../shared/BadCard';
import VisitCard from '../../shared/VisitCard';
import updateInstance from '../../../functions/api/lms/updateInstance';
import commaNumbers from '../../../functions/util/commaNumbers';
function UpdateDiskVolume({
  setInstanceAction,
  showPrepaidStorage
}) {
  const {
    customerId,
    computeStackId
  } = useParams();
  const navigate = useNavigate();
  const alert = useAlert();
  const auth = useStoreState(appState, s => s.auth);
  const hasCard = useStoreState(appState, s => s.hasCard);
  const badCard = useStoreState(appState, s => s.customer?.currentPaymentStatus?.status === 'invoice.payment_failed');
  const compute = useStoreState(instanceState, s => s.compute);
  const storage = useStoreState(instanceState, s => s.storage);
  const isLocal = useStoreState(instanceState, s => s.isLocal);
  const isBeingModified = useStoreState(instanceState, s => !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(s.status));
  const lastVolumeResize = useStoreState(instanceState, s => s.lastVolumeResize);
  const dataVolumeSize = useStoreState(instanceState, s => s.dataVolumeSize);
  const filteredProducts = useStoreState(appState, s => s.products.cloudStorage.filter(p => p.value.dataVolumeSize >= storage?.dataVolumeSize));
  const filteredSubscriptions = useStoreState(appState, s => s.subscriptions.cloudStorage.filter(p => (p.value.dataVolumeSize === dataVolumeSize || p.value.storageQuantityAvailable >= p.value.dataVolumeSize) && p.value.dataVolumeSize >= storage?.dataVolumeSize));
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({
    computeStackId,
    customerId,
    ...storage
  });
  const [hasChanged, setHasChanged] = useState(false);
  const products = showPrepaidStorage ? filteredSubscriptions : filteredProducts;
  const selectedProduct = products.find(p => p.value.dataVolumeSize === formData.dataVolumeSize && p.value.stripeStoragePlanId === formData.stripeStoragePlanId && p.value.storageSubscriptionId === formData.storageSubscriptionId);
  const totalFreeCloudInstances = auth.orgs.filter(o => auth.userId === o.ownerUserId).reduce((a, b) => a + b.freeCloudInstanceCount, 0);
  const canAddFreeCloudInstance = totalFreeCloudInstances < config.freeCloudInstanceLimit;
  const newTotal = (formData?.storagePrice || 0) + (compute?.computePrice || 0);
  const newTotalString = newTotal ? `${commaNumbers(newTotal.toFixed(2))}/${compute.computeInterval}` : 'FREE';
  const canChange = lastVolumeResize ? (Date.now() - new Date(lastVolumeResize).getTime()) / 1000 / 3600 > 6 : true;
  const resetFormData = () => setFormData({
    computeStackId,
    customerId,
    ...storage
  });
  useAsyncEffect(resetFormData, [showPrepaidStorage]);
  useAsyncEffect(() => {
    setHasChanged(storage?.dataVolumeSize !== formData.dataVolumeSize || storage?.stripeStoragePlanId !== formData.stripeStoragePlanId || storage?.storageSubscriptionId !== formData.storageSubscriptionId);
  }, [formData]);
  useAsyncEffect(() => {
    setHasChanged(false);
  }, [computeStackId]);
  useAsyncEffect(async () => {
    const {
      submitted
    } = formState;
    if (submitted) {
      setInstanceAction('Updating');
      const response = await updateInstance({
        auth,
        ...formData
      });
      if (response.error) {
        alert.error('There was an error updating your instance. Please try again later.');
        setInstanceAction(false);
      } else {
        if (window.Kmq) window.Kmq.push(['record', 'upgrade instance - disk size', {
          totalPrice: formData?.computePrice,
          currency: 'USD',
          products: [{
            name: 'storage',
            id: selectedProduct.dataVolumeSizeString,
            price: formData?.storagePrice || 0
          }]
        }]);
        alert.success('Instance update initialized successfully');
        appState.update(s => {
          s.lastUpdate = Date.now();
        });
        setTimeout(() => navigate(`/o/${customerId}/instances`), 100);
      }
    }
  }, [formState]);
  return isBeingModified ? <Card className="error">
      <CardBody>instance updating. please wait.</CardBody>
    </Card> : <>
      <SelectDropdown className="react-select-container" classNamePrefix="react-select" onChange={({
      value
    }) => setFormData({
      ...formData,
      ...value
    })} options={products.filter(p => p.value.active)} value={selectedProduct} defaultValue={storage} isSearchable={false} isClearable={false} isLoading={!products} placeholder="Select Data Volume Size" styles={{
      placeholder: styles => ({
        ...styles,
        textAlign: 'center',
        width: '100%',
        color: '#BCBCBC'
      })
    }} />
      {hasChanged && !formData.storageSubscriptionId && !newTotal && !isLocal && !canAddFreeCloudInstance ? <Card className="error mt-3">
          <CardBody>
            You are limited to {config.freeCloudInstanceLimit} free cloud instance{config.freeCloudInstanceLimit !== 1 ? 's' : ''}
          </CardBody>
        </Card> : hasChanged && !canChange ? <Card className="error mt-3 text-start">
          <CardBody>
            You may update disk size every 6 hours
            <br />
            <br />
            Last resize: {new Date(lastVolumeResize).toLocaleTimeString()}
            <br />
            <br />
            Try again at: {new Date(new Date(lastVolumeResize).getTime() + 21600000).toLocaleTimeString()}
          </CardBody>
        </Card> : hasChanged && (formData?.storagePrice || compute?.computePrice) && badCard ? <div className="mt-3">
          <BadCard />
          <VisitCard disabled={!hasChanged || formState.submitted} label="Update Credit Card" onClick={() => navigate(`/o/${customerId}/billing?returnURL=/${customerId}/i/${computeStackId}/config`)} />
        </div> : hasChanged && (formData?.storagePrice || compute?.computePrice) && !hasCard ? <VisitCard disabled={!hasChanged || formState.submitted} label="Add Credit Card To Account" onClick={() => navigate(`/o/${customerId}/billing?returnURL=/${customerId}/i/${computeStackId}/config`)} /> : hasChanged ? <>
          <ChangeSummary which="storage" compute={compute?.computePriceStringWithInterval} storage={formData?.storagePriceStringWithInterval || 'FREE'} total={newTotalString} />
          <Row>
            <Col>
              <Button id="cancelChange" onClick={resetFormData} title="Cancel" block disabled={formState.submitted} color="grey">
                Cancel
              </Button>
            </Col>
            <Col>
              <Button id="confirmChange" onClick={() => setFormState({
            submitted: true
          })} title="Confirm Instance Details" block disabled={!hasChanged || formState.submitted} color="success">
                Update
              </Button>
            </Col>
          </Row>
        </> : null}
    </>;
}
export default UpdateDiskVolume;