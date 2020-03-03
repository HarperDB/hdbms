import React, { useState } from 'react';
import { Col, Row, Button, Card, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import addInstance from '../../../api/lms/addInstance';
import useInstanceAuth from '../../../state/stores/instanceAuths';

export default ({ newInstance, computeProduct, storageProduct, setShowForm, setPurchaseStep, lmsAuth }) => {
  const [formData, updateForm] = useState({ submitted: false, error: false });
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  let totalPrice = 0;
  if (computeProduct.price !== 'FREE') totalPrice += parseFloat(computeProduct.price);
  if (storageProduct.price !== 'FREE') totalPrice += parseFloat(storageProduct.price);

  useAsyncEffect(async () => {
    const { submitted } = formData;
    if (submitted) {
      const newInstanceAuth = { user: newInstance.user, pass: newInstance.pass };
      delete newInstance.user;
      delete newInstance.pass;

      const response = await addInstance({ auth: lmsAuth, payload: { ...newInstance } });
      if (response.result) {
        setInstanceAuths({ ...instanceAuths, [response.instance_id]: newInstanceAuth });
        updateForm({ submitted: false, error: false });
        setTimeout(() => setShowForm(false), 0);
      } else {
        updateForm({ submitted: false, error: response.message });
      }
    }
  }, [formData]);

  return (
    <>
      <Card>
        <CardBody>
          <Row>
            <Col xs="7">
              Instance Name
            </Col>
            <Col xs="5" className="text-right">
              {newInstance.instance_name}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs="7">
              Admin User
            </Col>
            <Col xs="5" className="text-right">
              {newInstance.user}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs="7">
              Admin Password
            </Col>
            <Col xs="5" className="text-right">
              {newInstance.pass}
            </Col>
          </Row>
          <hr />
          {newInstance.is_local ? (
            <>
              <Row>
                <Col xs="7">
                  Host
                </Col>
                <Col xs="5" className="text-right">
                  {newInstance.host}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xs="7">
                  Port
                </Col>
                <Col xs="5" className="text-right">
                  {newInstance.port}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xs="7">
                  Uses SSL
                </Col>
                <Col xs="5" className="text-right">
                  {newInstance.is_ssl.toString()}
                </Col>
              </Row>
              <hr />
            </>
          ) : (
            <>
              <Row>
                <Col xs="7">
                  Instance Region
                </Col>
                <Col xs="5" className="text-right">
                  {newInstance.instance_region}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xs="4">
                  Instance Storage
                </Col>
                <Col xs="4" className="text-right">
                  {storageProduct.disk_space}
                </Col>
                <Col xs="4" className="text-right">
                  {storageProduct.price === 'FREE' ? 'FREE' : `$${storageProduct.price}/${storageProduct.interval}`}
                </Col>
              </Row>
              <hr />
            </>
          )}
          <Row>
            <Col xs="4">
              Instance RAM
            </Col>
            <Col xs="4" className="text-right">
              {computeProduct.ram}
            </Col>
            <Col xs="4" className="text-right">
              {computeProduct.price === 'FREE' ? 'FREE' : `$${computeProduct.price}/${computeProduct.interval}`}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs="7">
              <b>Instance Total Price</b>
            </Col>
            <Col xs="5" className="text-right">
              <b>{totalPrice ? `$${totalPrice.toFixed(2)}/${computeProduct.interval}` : 'FREE'}</b>
            </Col>
          </Row>

        </CardBody>
      </Card>
      <Row>
        <Col sm="6">
          <Button
            onClick={() => setPurchaseStep(`details_${newInstance.is_local ? 'local' : 'cloud'}`)}
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
            onClick={() => updateForm({ ...formData, submitted: true, error: false })}
            title="Confirm Instance Details"
            block
            className="mt-3"
            color="purple"
          >
            Add Instance<i className="fa fa-check-circle ml-2" />
          </Button>
        </Col>
      </Row>
    </>
  );
};
