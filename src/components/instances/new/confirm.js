import React, { useState } from 'react';
import { Col, Row, Button, Card, CardBody, RadioCheckbox } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';

import config from '../../../../config';
import useNewInstance from '../../../state/stores/newInstance';

export default ({ computeProduct, storageProduct }) => {
  const history = useHistory();
  const [newInstance, setNewInstance] = useNewInstance({});
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({ tc_version: newInstance.tc_version || false });

  let totalPrice = 0;
  if (computeProduct && computeProduct.price !== 'FREE') totalPrice += parseFloat(computeProduct.price);
  if (storageProduct && storageProduct.price !== 'FREE') totalPrice += parseFloat(storageProduct.price);

  useAsyncEffect(() => {
    const { submitted } = formState;
    const { tc_version } = formData;
    if (submitted) {
      if (tc_version) {
        setNewInstance({ ...newInstance, tc_version });
        setTimeout(() => history.push('/instances/new/status'), 0);
      } else {
        setFormState({ error: 'You must agree to the HarperDB Terms of Use, End User License Agreement, and HarperDB Cloud Terms of Service.' });
      }
    }
  }, [formState]);

  return (
    <>
      <Card>
        <CardBody>
          <Row>
            <Col xs="4" className="text-nowrap">
              Instance Name
            </Col>
            <Col xs="8" className="text-right text-nowrap">
              {newInstance.instance_name}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs="4" className="text-nowrap">
              Admin User
            </Col>
            <Col xs="8" className="text-right text-nowrap">
              {newInstance.user}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs="4" className="text-nowrap">
              Admin Password
            </Col>
            <Col xs="8" className="text-right text-nowrap">
              {newInstance.pass}
            </Col>
          </Row>
          <hr />
          {newInstance.is_local ? (
            <>
              <Row>
                <Col xs="4" className="text-nowrap">
                  Host
                </Col>
                <Col xs="8" className="text-right text-nowrap">
                  {newInstance.host}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xs="4" className="text-nowrap">
                  Port
                </Col>
                <Col xs="8" className="text-right text-nowrap">
                  {newInstance.port}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xs="4" className="text-nowrap">
                  Uses SSL
                </Col>
                <Col xs="8" className="text-right text-nowrap">
                  {newInstance.is_ssl.toString()}
                </Col>
              </Row>
              <hr />
            </>
          ) : (
            <>
              <Row>
                <Col xs="4" className="text-nowrap">
                  Instance Region
                </Col>
                <Col xs="8" className="text-right text-nowrap">
                  {newInstance.instance_region}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xs="6" className="text-nowrap">
                  Instance Storage
                </Col>
                <Col xs="2" className="text-right text-nowrap">
                  {storageProduct && storageProduct.disk_space}
                </Col>
                <Col xs="4" className="text-right text-nowrap">
                  {!storageProduct ? '' : storageProduct.price === 'FREE' ? 'FREE' : `$${storageProduct.price}/${storageProduct.interval}`}
                </Col>
              </Row>
              <hr />
            </>
          )}
          <Row>
            <Col xs="6" className="text-nowrap">
              Instance RAM
            </Col>
            <Col xs="2" className="text-right text-nowrap">
              {computeProduct && computeProduct.ram}
            </Col>
            <Col xs="4" className="text-right text-nowrap">
              {!computeProduct ? '' : computeProduct.price === 'FREE' ? 'FREE' : `$${computeProduct.price}/${computeProduct.interval}`}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs="8" className="text-nowrap">
              <b>Instance Total Price</b>
            </Col>
            <Col xs="4" className="text-right text-nowrap">
              <b>{totalPrice ? `$${totalPrice.toFixed(2)}/${computeProduct && computeProduct.interval}` : 'FREE'}</b>
            </Col>
          </Row>

        </CardBody>
      </Card>
      <Card className="mt-3">
        <CardBody>
          <Row noGutters>
            <Col xs="1" className="text-nowrap overflow-hidden">
              <RadioCheckbox
                className={formState.error ? 'error' : ''}
                type="radio"
                onChange={(value) => updateForm({ tc_version: value })}
                options={{ value: config.tc_version }}
              />
            </Col>
            <Col xs="11" className="text-small">
              I agree to the HarperDB <a href="https://harperdb.io/legal/terms-of-use/" target="_blank" rel="noopener noreferrer">Terms of Use</a>, <a href="https://harperdb.io/legal/end-user-license-agreement/" target="_blank" rel="noopener noreferrer">End User License Agreement</a>, and <a href="https://harperdb.io/legal/harperdb-cloud-terms-of-service/" target="_blank" rel="noopener noreferrer">HarperDB Cloud Terms of Service</a>.
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button
            onClick={() => history.push(`/instances/new/details_${newInstance.is_local ? 'local' : 'cloud'}`)}
            title="Back to Instance Details"
            block
            className="mt-3"
            color="purple"
            outline
          >
            <i className="fa fa-chevron-circle-left mr-2" />Instance Details
          </Button>
        </Col>
        <Col sm="6">
          <Button
            onClick={() => setFormState({ submitted: true })}
            title="Confirm Instance Details"
            block
            className="mt-3"
            color="purple"
          >
            Add Instance<i className="fa fa-check-circle ml-2" />
          </Button>
        </Col>
      </Row>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody className="text-danger text-small text-center">
            {formState.error}
          </CardBody>
        </Card>
      )}
    </>
  );
};
