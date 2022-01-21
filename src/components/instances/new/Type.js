import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import useNewInstance from '../../../functions/state/newInstance';

function Type() {
  const history = useHistory();
  const { customer_id } = useParams();
  const [, setNewInstance] = useNewInstance({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(() => {
    const { is_local } = formData;
    if (is_local !== undefined) {
      setNewInstance({ customer_id, is_local });
      setTimeout(() => history.push(is_local ? `/o/${customer_id}/instances/new/meta_local` : `/o/${customer_id}/instances/new/meta_cloud`), 0);
    }
  }, [formData]);

  return (
    <Row>
      <Col xs="12" lg="6" className="instance-form-card-holder">
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
            <Button id="createCloudInstanceButton" className="mt-3" color="purple" block onClick={() => setFormData({ is_local: false })}>
              Create HarperDB Cloud Instance
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
                  Click Here To Install HarperDB Yourself
                </a>
              </li>
              <li>Browse Instance Data</li>
              <li>Configure Users, Roles, and Clustering</li>
              <li>Manage Instance Licenses</li>
              <li>Handle Version Upgrades</li>
              <li>Instance Credentials Stay Local</li>
            </ul>
            <hr />
            <Button id="createLocalInstanceButton" className="mt-3" color="purple" block onClick={() => setFormData({ is_local: true })}>
              Register User-Installed Instance
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default Type;
