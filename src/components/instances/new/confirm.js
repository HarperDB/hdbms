import React from 'react';
import { Col, Row, Button, Card, CardBody } from '@nio/ui-kit';

import { useHistory } from 'react-router';
import useNewInstance from '../../../state/stores/newInstance';
import defaultNewInstanceData from '../../../state/defaults/defaultNewInstanceData';

export default ({ computeProduct, storageProduct }) => {
  const history = useHistory();
  const [newInstance] = useNewInstance(defaultNewInstanceData);

  let totalPrice = 0;
  if (computeProduct && computeProduct.price !== 'FREE') totalPrice += parseFloat(computeProduct.price);
  if (storageProduct && storageProduct.price !== 'FREE') totalPrice += parseFloat(storageProduct.price);

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
            onClick={() => history.push('/instances/new/status')}
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
