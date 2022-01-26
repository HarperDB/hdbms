import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import useNewInstance from '../../../functions/state/newInstance';
import appState from '../../../functions/state/appState';

function Type() {
  const history = useHistory();
  const { customer_id } = useParams();
  const [, setNewInstance] = useNewInstance({});
  const wavelengthRegions = useStoreState(appState, (s) => s.wavelengthRegions.length);
  const [formData, setFormData] = useState({});

  useAsyncEffect(() => {
    const { is_local, is_wavelength } = formData;
    if (is_local !== undefined && is_wavelength !== undefined) {
      setNewInstance({ customer_id, is_local, is_wavelength });
      setTimeout(() => history.push(is_local ? `/o/${customer_id}/instances/new/meta_local` : `/o/${customer_id}/instances/new/meta_cloud`), 0);
    }
  }, [formData]);

  return (
    <Row>
      <Col xs="12" lg={wavelengthRegions ? 4 : 6} className="instance-form-card-holder">
        <Card>
          <CardBody className="instance-form-card-body">
            <div className="text-bold text-center">Create New HarperDB Cloud Instance</div>
            <hr />
            <ul>
              <li>Free License Tier Available!</li>
              <li>Hosted on AWS</li>
              <li>Managed by HarperDB</li>
              <li>HarperDB License Included</li>
              <li>24/7 Customer Support</li>
              <li>Choose RAM and Disk Size</li>
              <li>Scale On Demand</li>
            </ul>
            <hr />
            <Button id="createCloudInstanceButton" className="mt-3" color="purple" block onClick={() => setFormData({ is_local: false, is_wavelength: false })}>
              Create HarperDB Cloud Instance
            </Button>
          </CardBody>
        </Card>
      </Col>
      {wavelengthRegions && (
        <Col xs="12" lg="4" className="instance-form-card-holder">
          <Card>
            <CardBody className="instance-form-card-body">
              <div className="text-bold text-center">Create New 5G Wavelength Instance</div>
              <hr />
              <ul>
                <li>Accessible within Verizon network</li>
                <li>No public internet = blazing speed</li>
                <li>Managed by HarperDB</li>
                <li>HarperDB License Included</li>
                <li>24/7 Customer Support</li>
                <li>Choose RAM and Disk Size</li>
                <li>Scale On Demand</li>
              </ul>
              <hr />
              <Button id="createWavelengthInstanceButton" className="mt-3" color="purple" block onClick={() => setFormData({ is_local: false, is_wavelength: true })}>
                Create 5G Wavelength Instance
              </Button>
            </CardBody>
          </Card>
        </Col>
      )}
      <Col xs="12" lg={wavelengthRegions ? 4 : 6} className="instance-form-card-holder">
        <Card>
          <CardBody className="instance-form-card-body">
            <div className="text-bold text-center">Register User-Installed Instance</div>
            <hr />
            <ul>
              <li>Free License Tier Available!</li>
              <li>
                <a href="https://harperdb.io/docs/install-harperdb/" target="_blank" rel="noopener noreferrer">
                  Click Here To Install HarperDB
                </a>
              </li>
              <li>Browse Instance Data</li>
              <li>Configure Users, Roles, Clustering</li>
              <li>Manage Instance Licenses</li>
              <li>Handle Version Upgrades</li>
              <li>Instance Credentials Stay Local</li>
            </ul>
            <hr />
            <Button id="createLocalInstanceButton" className="mt-3" color="purple" block onClick={() => setFormData({ is_local: true, is_wavelength: false })}>
              Register User-Installed Instance
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default Type;
