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
  const is_lumen = useStoreState(appState, (s) => s.is_lumen);
  const [formData, setFormData] = useState({});
  const manager_label = is_lumen ? 'Lumen' : 'HarperDB';
  const hosting_location = is_lumen ? 'Lumen Edge' : 'AWS or Verizon Wavelength';
  const instance_label = is_lumen ? `Lumen Edge HarperDB Instance` : 'HarperDB Cloud Instance';

  useAsyncEffect(() => {
    const { is_local } = formData;
    if (is_local !== undefined) {
      setNewInstance({ customer_id, is_local, is_lumen });
      setTimeout(
        () =>
          history.push(
            is_local ? `/o/${customer_id}/instances/new/meta_local` : is_lumen ? `/o/${customer_id}/instances/new/meta_cloud` : `/o/${customer_id}/instances/new/provider_cloud`
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
            <div className="text-bold text-center">{instance_label}</div>
            <hr />
            <ul>
              <li>Free License Tier Available!</li>
              <li>Hosted on {hosting_location}</li>
              <li>Managed by {manager_label}</li>
              <li>Monthly HarperDB License Included</li>
              <li>24/7 Customer Support</li>
              <li>Choose RAM and Disk Size</li>
              <li>Scale On Demand</li>
            </ul>
            <hr />
            <Button id="createCloudInstanceButton" className="mt-3" color="purple" block onClick={() => setFormData({ is_local: false, is_wavelength: false })}>
              Create {instance_label}
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
