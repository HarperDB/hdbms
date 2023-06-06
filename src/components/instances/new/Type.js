import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useParams, useNavigate } from 'react-router-dom';

import useNewInstance from '../../../functions/state/newInstance';
import AWSLogo from '../../shared/logos/AWSLogo';
import VerizonLogo from '../../shared/logos/VerizonLogo';
import AkamaiLogo from '../../shared/logos/AkamaiLogo';
import HarperDBDogLogo from '../../shared/logos/HarperDBDogLogo';

function Type() {
  const navigate = useNavigate();
  const { customer_id } = useParams();
  const [, setNewInstance] = useNewInstance({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(() => {
    const { cloud_provider, is_local, is_wavelength, is_akamai } = formData;

    if (is_local !== undefined) {
      setNewInstance({ customer_id, cloud_provider, is_local, is_wavelength, is_akamai });
      setTimeout(() => navigate(is_local ? `/o/${customer_id}/instances/new/meta_local` : `/o/${customer_id}/instances/new/meta_cloud`), 0);
    }
  }, [formData]);

  return (
    <Row>
      <Col xs="12" lg="6" className="instance-form-card-holder">
        <Card className="mb-3">
          <CardBody className="instance-form-card-body">
            <Row>
              <Col xs="8" className="logo-header">
                <AWSLogo />
              </Col>
              <Col xs="4">
                <Button
                  id="createCloudInstanceButton"
                  color="purple"
                  block
                  onClick={() => setFormData({ cloud_provider: 'aws', is_local: false, is_wavelength: false, is_akamai: false })}
                >
                  Create
                </Button>
              </Col>
            </Row>

            <hr />
            <ul className="mb-0">
              <li>Hosted on AWS EC2</li>
              <li>Licensed Monthly, Free Tier Available</li>
              <li>24/7 Customer Support</li>
              <li>Choose RAM and Disk Size</li>
            </ul>
          </CardBody>
        </Card>
      </Col>
      <Col xs="12" lg="6" className="instance-form-card-holder">
        <Card className="mb-3">
          <CardBody className="instance-form-card-body">
            <Row>
              <Col xs="8" className="logo-header">
                <VerizonLogo />
              </Col>
              <Col xs="4">
                <Button
                  id="createCloudInstanceButton"
                  color="purple"
                  block
                  onClick={() => setFormData({ cloud_provider: 'verizon', is_local: false, is_wavelength: true, is_akamai: false })}
                >
                  Create
                </Button>
              </Col>
            </Row>

            <hr />
            <ul className="mb-0">
              <li>Hosted on Verizon&apos;s 5G Wavelength</li>
              <li>Licensed Monthly</li>
              <li>24/7 Customer Support</li>
              <li>Choose RAM and Disk Size</li>
            </ul>
          </CardBody>
        </Card>
      </Col>
      <Col xs="12" lg="6" className="instance-form-card-holder">
        <Card className="mb-3">
          <CardBody className="instance-form-card-body">
            <Row>
              <Col xs="8" className="logo-header">
                <AkamaiLogo />
              </Col>
              <Col xs="4">
                <Button
                  id="createCloudInstanceButton"
                  color="purple"
                  block
                  onClick={() => setFormData({ cloud_provider: 'akamai', is_local: false, is_wavelength: false, is_akamai: true })}
                >
                  Create
                </Button>
              </Col>
            </Row>

            <hr />
            <ul className="mb-0">
              <li>Hosted on Akamai Connected Cloud</li>
              <li>Licensed Monthly</li>
              <li>24/7 Customer Support</li>
              <li>Choose RAM and Disk Size</li>
            </ul>
          </CardBody>
        </Card>
      </Col>
      <Col xs="12" lg="6" className="instance-form-card-holder">
        <Card className="mb-3">
          <CardBody className="instance-form-card-body">
            <Row>
              <Col xs="8" className="logo-header">
                <HarperDBDogLogo />
                <div className="ps-2">Enterprise</div>
              </Col>
              <Col xs="4">
                <Button
                  id="createLocalInstanceButton"
                  color="purple"
                  block
                  onClick={() => setFormData({ cloud_provider: null, is_local: true, is_wavelength: false, is_akamai: false })}
                >
                  Register
                </Button>
              </Col>
            </Row>

            <hr />
            <ul className="mb-0">
              <li>On-Prem, Public/Private Cloud Deployments</li>
              <li>Licensed Annually, Free Tier Available</li>
              <li>24/7 Customer Support</li>
              <li>
                <a href="https://docs.harperdb.io/docs/install-harperdb" target="_blank" rel="noopener noreferrer">
                  Click Here To Install HarperDB
                </a>
              </li>
            </ul>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default Type;
