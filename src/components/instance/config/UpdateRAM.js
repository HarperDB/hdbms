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
import updateInstance from '../../../functions/api/lms/updateInstance';
import commaNumbers from '../../../functions/util/commaNumbers';
import VisitCard from '../../shared/VisitCard';
function UpdateRAM({
  setInstanceAction,
  showPrepaidCompute
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
  const isWavelength = useStoreState(instanceState, s => s.wavelengthZoneId);
  const computeSubscriptionId = useStoreState(instanceState, s => s.computeSubscriptionId);
  const isBeingModified = useStoreState(instanceState, s => !['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(s.status));
  const filteredProducts = useStoreState(appState, s => s.products[isLocal ? 'local_compute' : isWavelength ? 'wavelength_compute' : 'cloud_compute']);
  const filteredSubscriptions = useStoreState(appState, s => s.subscriptions[isLocal ? 'local_compute' : isWavelength ? 'wavelength_compute' : 'cloud_compute'].filter(p => p.value.computeSubscriptionId === computeSubscriptionId || p.value.computeQuantityAvailable));
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({
    computeStackId,
    customerId,
    ...compute
  });
  const [hasChanged, setHasChanged] = useState(false);
  const products = showPrepaidCompute ? filteredSubscriptions : filteredProducts;
  const selectedProduct = products.find(p => p.value.stripePlanId === formData.stripePlanId && p.value.computeSubscriptionId === formData.computeSubscriptionId);
  const totalFreeCloudInstances = auth.orgs.filter(o => auth.userId === o.ownerUserId).reduce((a, b) => a + b.freeCloudInstanceCount, 0);
  const canAddFreeCloudInstance = totalFreeCloudInstances < config.freeCloudInstanceLimit;
  const newTotal = (storage?.storagePrice || 0) + (formData?.computePrice || 0);
  const newTotalString = newTotal ? `${commaNumbers(newTotal.toFixed(2))}/${compute.computeInterval}` : 'FREE';
  const resetFormData = () => setFormData({
    computeStackId,
    customerId,
    ...compute
  });
  useAsyncEffect(resetFormData, [showPrepaidCompute]);
  useAsyncEffect(() => {
    setHasChanged(compute?.stripePlanId !== formData.stripePlanId || formData.computeSubscriptionId !== compute?.computeSubscriptionId);
  }, [formData]);
  useAsyncEffect(() => {
    setHasChanged(false);
  }, [computeStackId]);
  useAsyncEffect(async () => {
    const {
      submitted
    } = formState;
    if (submitted) {
      if (!newTotal && !formData.computeSubscriptionId && !isLocal && !canAddFreeCloudInstance) {
        alert.error(`You are limited to ${config.freeCloudInstanceLimit} free cloud instance${config.freeCloudInstanceLimit !== 1 ? 's' : ''}`);
        resetFormData();
        setFormState({});
      } else {
        setInstanceAction('Updating');
        const response = await updateInstance({
          auth,
          ...formData
        });
        if (response.error) {
          alert.error('There was an error updating your instance. Please try again later.');
          setInstanceAction(false);
        } else {
          if (window.Kmq) window.Kmq.push(['record', 'upgrade instance - RAM', {
            totalPrice: formData?.computePrice,
            currency: 'USD',
            products: [{
              name: 'compute',
              id: selectedProduct.computeRamString,
              price: formData?.computePrice || 0
            }]
          }]);
          alert.success('Instance update initialized successfully');
          appState.update(s => {
            s.lastUpdate = Date.now();
          });
          setTimeout(() => navigate(`/o/${customerId}/instances`), 100);
        }
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
    })} options={products.filter(p => p.value.active)} value={selectedProduct} defaultValue={compute} isSearchable={false} isClearable={false} isLoading={!products} placeholder="select a RAM allotment" styles={{
      placeholder: styles => ({
        ...styles,
        textAlign: 'center',
        width: '100%',
        color: '#BCBCBC'
      })
    }} />
      {hasChanged && !newTotal && !formData.computeSubscriptionId && !isLocal && !canAddFreeCloudInstance ? <Card className="error mt-2">
          <CardBody>
            You are limited to {config.freeCloudInstanceLimit} free cloud instance{config.freeCloudInstanceLimit !== 1 ? 's' : ''}
          </CardBody>
        </Card> : hasChanged && (storage?.storagePrice || formData?.computePrice) && badCard ? <div className="mt-3">
          <BadCard />
          <VisitCard disabled={!hasChanged || formState.submitted} label="Update Credit Card" onClick={() => navigate(`/o/${customerId}/billing?returnURL=/${customerId}/i/${computeStackId}/config`)} />
        </div> : hasChanged && (storage?.storagePrice || formData?.computePrice) && !hasCard ? <VisitCard disabled={!hasChanged || formState.submitted} label="Add Credit Card To Account" onClick={() => navigate(`/o/${customerId}/billing?returnURL=/${customerId}/i/${computeStackId}/config`)} /> : hasChanged ? <>
          <ChangeSummary which="compute" compute={formData.computePriceStringWithInterval} storage={storage?.storagePriceStringWithInterval || 'FREE'} total={newTotalString} />
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
export default UpdateRAM;