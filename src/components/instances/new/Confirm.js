/* eslint-disable max-lines */
import React, { useState } from 'react';
import { Col, Row, Button, Card, CardBody } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import appState from '../../../functions/state/appState';
import config from '../../../config';
import useNewInstance from '../../../functions/state/newInstance';
import CouponForm from '../../shared/CouponForm';
import RadioCheckbox from '../../shared/RadioCheckbox';
import commaNumbers from '../../../functions/util/commaNumbers';
import Unpaid from '../../shared/Unpaid';
import UnlimitedEnterprise from '../../shared/UnlimitedEnterprise';
function Confirm() {
  const navigate = useNavigate();
  const {
    customerId
  } = useParams();
  const [newInstance, setNewInstance] = useNewInstance({});
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({
    tcVersion: newInstance.tcVersion || false
  });
  const isUnpaid = useStoreState(appState, s => s.customer.isUnpaid);
  const unlimitedLocalInstall = useStoreState(appState, s => s.customer.unlimitedLocalInstall);
  const stripeCoupons = useStoreState(appState, s => s.customer?.stripeCoupons);
  const subdomain = useStoreState(appState, s => s.customer?.subdomain);
  const totalPrice = (newInstance?.computePrice || 0) + (newInstance?.storagePrice || 0);
  const allPrePaid = newInstance.computeSubscriptionId && (newInstance.isLocal || newInstance.storageSubscriptionId);
  const somePrePaid = newInstance.computeSubscriptionId || newInstance.storageSubscriptionId;
  const wavelengthRegions = useStoreState(appState, s => s.wavelengthRegions);
  const instanceRegionLabel = newInstance.isWavelength ? wavelengthRegions.find(r => r.value === newInstance.instanceRegion).label : newInstance.instanceRegion;
  const totalPriceString = allPrePaid ? 'PREPAID' : totalPrice ? `$${commaNumbers(totalPrice.toFixed(2))}/${newInstance.computeInterval}` : somePrePaid ? 'PREPAID / FREE' : 'FREE';
  const analyticsProductsArray = [{
    name: 'compute',
    id: newInstance.computeRamString,
    price: newInstance?.computePrice || 0
  }];
  if (!newInstance.isLocal) {
    analyticsProductsArray.push({
      name: 'storage',
      id: newInstance.dataVolumeSizeString,
      price: newInstance?.storagePrice || 0
    });
  }
  useAsyncEffect(() => {
    const {
      submitted
    } = formState;
    const {
      tcVersion
    } = formData;
    if (submitted) {
      if (tcVersion) {
        if (window.Kmq) window.Kmq.push(['record', totalPrice ? 'purchased instance' : 'created free instance', analyticsProductsArray]);
        setNewInstance({
          ...newInstance,
          tcVersion
        });
        setTimeout(() => navigate(`/o/${customerId}/instances/new/status`), 0);
      } else {
        setFormState({
          error: 'Please agree to the Privacy Policy and Cloud Terms of Service.'
        });
      }
    }
  }, [formState]);
  return <>
      <Card>
        <CardBody>
          <Row>
            <Col sm="4" className="text-nowrap text-grey">
              Instance Name
            </Col>
            <Col sm="8" className="text-sm-end text-nowrap">
              {newInstance.instanceName}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col sm="4" className="text-nowrap text-grey">
              Admin User
            </Col>
            <Col sm="8" className="text-sm-end text-nowrap">
              {newInstance.user}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col sm="4" className="text-nowrap text-grey">
              Admin Password
            </Col>
            <Col sm="8" className="text-sm-end text-nowrap">
              ********
            </Col>
          </Row>
          <hr />
          {newInstance.isLocal ? <>
              <Row>
                <Col sm="4" className="text-nowrap text-grey">
                  Host
                </Col>
                <Col sm="8" className="text-sm-end text-nowrap">
                  {newInstance.host}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="4" className="text-nowrap text-grey">
                  Port
                </Col>
                <Col sm="8" className="text-sm-end text-nowrap">
                  {newInstance.port}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="4" className="text-nowrap text-grey">
                  Uses SSL
                </Col>
                <Col sm="8" className="text-sm-end text-nowrap">
                  {newInstance.isSsl ? 'yes' : 'no'}
                </Col>
              </Row>
              <hr />
            </> : <>
              <Row>
                <Col sm="4" className="text-nowrap text-grey">
                  Instance URL
                </Col>
                <Col sm="8" className="text-sm-end text-nowrap">
                  {newInstance.instanceName}-{subdomain}.harperdbcloud.com
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="4" className="text-nowrap text-grey">
                  Instance Region
                </Col>
                <Col sm="8" className="text-sm-end text-nowrap">
                  {instanceRegionLabel}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="6" className="text-nowrap text-grey">
                  Instance Storage
                </Col>
                <Col xs="4" sm="2" className="text-sm-end text-nowrap">
                  {newInstance.dataVolumeSizeString}
                </Col>
                <Col xs="8" sm="4" className="text-sm-end text-nowrap text-truncate">
                  {newInstance.storagePriceStringWithInterval}
                </Col>
              </Row>
              <hr />
            </>}
          <Row>
            <Col sm="6" className="text-nowrap text-grey">
              Instance RAM
            </Col>
            <Col xs="4" sm="2" className="text-sm-end text-nowrap">
              {newInstance.computeRamString}
            </Col>
            <Col xs="8" sm="4" className="text-sm-end text-nowrap text-truncate">
              {newInstance.computePriceStringWithInterval}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col sm="8" className="text-nowrap text-grey">
              Instance Total Price
            </Col>
            <Col sm="4" className="text-sm-end text-nowrap">
              <b>{totalPriceString}</b>
            </Col>
          </Row>
          {newInstance.trialPeriodDays && <>
              <hr />
              <Row>
                <Col sm="8" className="text-nowrap text-grey">
                  Free Trial Period
                </Col>
                <Col sm="4" className="text-sm-end text-nowrap">
                  <b>{newInstance.trialPeriodDays} Days</b>
                </Col>
              </Row>
            </>}
        </CardBody>
      </Card>
      <hr className="my-3" />
      {isUnpaid ? <Unpaid /> : unlimitedLocalInstall ? <UnlimitedEnterprise /> : stripeCoupons?.length ? <div className="px-2 text-center text-success">
          This organization has <b>{stripeCoupons.length}</b> coupon{stripeCoupons.length > 1 && 's'} on file, good for a total product credit of{' '}
          <b>${stripeCoupons.reduce((total, coupon) => total + parseInt(coupon.amountOff / 100, 10), 0)}</b>. Charges beyond that amount will be billed to your card.
        </div> : <div className="px-2">
          <CouponForm />
        </div>}
      <hr className="my-3" />
      <Row className="g-0">
        <Col xs="2" sm="1" className="text-nowrap overflow-hidden ps-2">
          <RadioCheckbox id="agreeToTermsAndConditions" className={formState.error ? 'error' : ''} type="radio" onChange={value => setFormData({
          tcVersion: value
        })} options={{
          value: config.tcVersion
        }} />
        </Col>
        <Col xs="10" sm="11" className="text-small pt-1 pe-2">
          I agree to HarperDB&apos;s&nbsp;
          <a href="https://harperdb.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="https://harperdb.io/legal/harperdb-cloud-terms-of-service/" target="_blank" rel="noopener noreferrer">
            HarperDB Cloud Terms of Service
          </a>
        </Col>
      </Row>
      <hr className="mt-3 mb-0" />
      <Row>
        <Col sm="6">
          <Button onClick={() => navigate(`/o/${customerId}/instances/new/details_${newInstance.isLocal ? 'local' : 'cloud'}`)} title="Back to Instance Details" block className="mt-3" color="purple">
            <i className="fa fa-chevron-circle-left me-2" />
            Instance Details
          </Button>
        </Col>
        <Col sm="6">
          <Button id="addInstance" onClick={() => setFormState({
          submitted: true
        })} title="Confirm Instance Details" block className="mt-3" color="purple">
            Add Instance
            <i className="fa fa-check-circle ms-2" />
          </Button>
        </Col>
      </Row>
      {formState.error && <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>}
    </>;
}
export default Confirm;