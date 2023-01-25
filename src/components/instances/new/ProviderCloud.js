import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useParams, useNavigate } from 'react-router-dom';

import useNewInstance from '../../../functions/state/newInstance';
import ContentContainer from '../../shared/ContentContainer';
import VerizonLogo from '../../shared/VerizonLogo';
import AWSLogo from '../../shared/AWSLogo';

function ProviderCloud() {
  const navigate = useNavigate();
  const { customer_id } = useParams();
  const [newInstance, setNewInstance] = useNewInstance({});
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ is_wavelength: false });

  useAsyncEffect(() => {
    const { submitted } = formState;
    const { is_wavelength } = formData;
    if (submitted) {
      if (is_wavelength !== undefined) {
        setNewInstance({ ...newInstance, is_wavelength });
        setTimeout(() => navigate(`/o/${customer_id}/instances/new/meta_cloud`), 0);
      } else {
        setFormState({ error: 'Please choose a cloud provider' });
      }
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({}), [formData]);

  return (
    <>
      <Card id="cloudProviderInfo">
        <CardBody>
          Select a cloud provider for your new instance. If you don&apos;t see your preferred provider,{' '}
          <a href="https://harperdb.featureupvote.com/" target="_blank" rel="noopener noreferrer">
            click here to add it to our roadmap
          </a>
          !
          <br />
          <br />
          <ContentContainer
            header={
              <>
                <AWSLogo />
                <span className="ms-3">HarperDB Cloud on AWS</span>
              </>
            }
          >
            <i className="text-small">Dedicated EC2 instances with SSDs deliver flexible performance and value.</i>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
            <div role="button" onClick={() => setFormData({ ...formData, is_wavelength: false })} className="mt-3">
              <div className={`radio-checkbox ${!formData.is_wavelength ? 'show' : 'hidden'}`}>
                <div className="dot" />
              </div>
              <div className="radio-checkbox-label">Choose HarperDB Cloud on AWS</div>
            </div>
          </ContentContainer>
          <ContentContainer
            header={
              <>
                <VerizonLogo />
                <span className="ms-3">HarperDB Cloud on Verizon Wavelength</span>
              </>
            }
          >
            <i className="text-small">Instances on Verizon&apos;s network for low-latency edge performance.</i>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
            <div role="button" onClick={() => setFormData({ ...formData, is_wavelength: true })} className="mt-3">
              <div className={`radio-checkbox ${formData.is_wavelength ? 'show' : 'hidden'}`}>
                <div className="dot" />
              </div>
              <div className="radio-checkbox-label">Choose HarperDB Cloud on Verizon Wavelength</div>
            </div>
          </ContentContainer>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button id="instanceTypeButton" onClick={() => navigate(`/o/${customer_id}/instances/new/type`)} title="Back to Instance Type" block className="mt-3" color="purple">
            <i className="fa fa-chevron-circle-left me-2" />
            Instance Type
          </Button>
        </Col>
        <Col sm="6">
          <Button id="instanceDetailsButton" onClick={() => setFormState({ submitted: true })} title="Instance Details" block className="mt-3" color="purple">
            Instance Info
            <i className="fa fa-chevron-circle-right ms-2" />
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default ProviderCloud;
