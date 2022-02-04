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
  const [formData, setFormData] = useState({});
  const platform = useStoreState(appState, (s) => (s.themes.length === 1 ? s.themes[0] : 'HarperDB'));
  const managerLabelString = platform === 'lumen' ? 'Lumen' : 'HarperDB';
  const hostingLocationString = platform === 'lumen' ? 'Lumen Edge' : platform === 'verizon' ? 'AWS Verizon Wavelength' : 'AWS or Verizon Wavelength';

  useAsyncEffect(() => {
    const { is_local } = formData;
    if (is_local !== undefined) {
      setNewInstance({ customer_id, is_local, platform });
      setTimeout(
        () =>
          history.push(
            is_local
              ? `/o/${customer_id}/instances/new/meta_local`
              : platform === 'HarperDB'
              ? `/o/${customer_id}/instances/new/provider_cloud`
              : `/o/${customer_id}/instances/new/meta_cloud`
          ),
        0
      );
    }
  }, [formData]);

  return (
    <Row>
      <Col xs="12" lg="6" className="instance-form-card-holder">
        <Card>
          <CardBody className="instance-form-card-body">
            <div className="text-bold text-center text-capitalize">{hostingLocationString} HarperDB Instance</div>
            <hr />
            <ul>
              <li>Free License Tier Available!</li>
              <li>Hosted on {hostingLocationString}</li>
              <li>Managed by {managerLabelString}</li>
              <li>Monthly HarperDB License Included</li>
              <li>24/7 Customer Support</li>
              <li>Choose RAM and Disk Size</li>
              <li>Scale On Demand</li>
            </ul>
            <hr />
            <Button id="createCloudInstanceButton" className="mt-3" color="purple" block onClick={() => setFormData({ is_local: false, is_wavelength: false })}>
              Create {hostingLocationString} Instance
            </Button>
          </CardBody>
        </Card>
      </Col>
      <Col xs="12" lg="6" className="instance-form-card-holder">
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
              <li>User-Managed</li>
              <li>Licensed Annually</li>
              <li>24/7 Community Support</li>
              <li>Choose RAM</li>
              <li>Upgrade On Demand</li>
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
