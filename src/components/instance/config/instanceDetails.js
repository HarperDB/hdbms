import React from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

export default ({ details: { instance_name, is_local, host, port, is_ssl, instance_region, disk_space }, activeCompute, activeStorage }) => {
  let totalPrice = 0;
  if (activeCompute.price !== 'FREE') totalPrice += parseFloat(activeCompute.price);
  if (activeStorage.price !== 'FREE') totalPrice += parseFloat(activeStorage.price);

  return (
    <Card className="my-3">
      <CardBody>
        <Card className="no-shadow no-background">
          <CardBody>
            <Row>
              <Col xs="7">
                Instance Name
              </Col>
              <Col xs="5" className="text-right">
                {instance_name}
              </Col>
            </Row>
            <hr />
            {is_local ? (
              <>
                <Row>
                  <Col xs="7">
                    Host
                  </Col>
                  <Col xs="5" className="text-right">
                    {host}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs="7">
                    Port
                  </Col>
                  <Col xs="5" className="text-right">
                    {port}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs="7">
                    Uses SSL
                  </Col>
                  <Col xs="5" className="text-right">
                    {is_ssl.toString()}
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
                    {instance_region}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs="4">
                    Instance Storage
                  </Col>
                  <Col xs="4" className="text-right">
                    {disk_space}
                  </Col>
                  <Col xs="4" className="text-right">
                    {activeStorage.price === 'FREE' ? 'FREE' : `$${activeStorage.price}/${activeStorage.interval}`}
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
                {activeCompute.ram}
              </Col>
              <Col xs="4" className="text-right">
                {activeCompute.price === 'FREE' ? 'FREE' : `$${activeCompute.price}/${activeCompute.interval}`}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs="7">
                <b>Instance Total Price</b>
              </Col>
              <Col xs="5" className="text-right">
                <b>{totalPrice ? `$${totalPrice.toFixed(2)}/${activeCompute.interval}` : 'FREE'}</b>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};
