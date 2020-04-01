import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';

import useNewInstance from '../../../state/stores/newInstance';

export default ({ canAddCloudInstance, cloudInstanceLimit, canAddLocalInstance, localInstanceLimit, cloudInstancesBeingModified }) => {
  const history = useHistory();
  const [newInstance, setNewInstance] = useNewInstance({});
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});

  useAsyncEffect(() => {
    const { is_local } = formData;
    if (is_local !== undefined) {
      if (is_local && localInstanceLimit && !canAddLocalInstance) {
        setFormState({
          error: `You have reached the limit of ${localInstanceLimit} total local instance${localInstanceLimit !== 1 ? 's' : ''}`,
        });
      } else if (!is_local && cloudInstanceLimit && !canAddCloudInstance) {
        setFormState({
          error: `You have reached the limit of ${cloudInstanceLimit} total cloud instance${cloudInstanceLimit !== 1 ? 's' : ''}`,
        });
      } else if (!is_local && cloudInstancesBeingModified) {
        setFormState({
          error: 'Please wait until your existing cloud instances are created',
        });
      } else {
        setNewInstance({
          ...newInstance,
          is_local,
        });
        setTimeout(() => history.push(is_local ? '/instances/new/meta_local' : '/instances/new/meta_cloud'), 0);
      }
    }
  }, [formData]);

  return (
    <>
      <Row>
        <Col xs="12" lg="6" className="instance-form-card-holder">
          <Card>
            <CardBody className="instance-form-card-body">
              <div className="text-bold text-center">Create HarperDB Cloud Instance</div>
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
              <Button
                className="mt-3"
                color="purple"
                block
                onClick={() =>
                  updateForm({
                    is_local: false,
                  })
                }
              >
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
                  <a href="https://harperdb.io/developers/get-started/" target="_blank" rel="noopener noreferrer">
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
              <Button
                className="mt-3"
                color="purple"
                block
                onClick={() =>
                  updateForm({
                    is_local: true,
                  })
                }
              >
                Register User-Installed Instance
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody className="text-danger text-small text-center">{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
};
