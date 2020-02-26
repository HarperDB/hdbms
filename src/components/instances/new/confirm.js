import React from 'react';
import { Col, Row, Button, Card, CardBody } from '@nio/ui-kit';

export default ({ instancePrice, instanceDetails, instanceSpecs, setConfirmed }) => (
  <>
    <Card>
      <CardBody>
        <Row>
          <Col xs="7">
            Monthly Cost
          </Col>
          <Col xs="5" className="text-right">
            ${instancePrice}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs="7">
            Instance Name
          </Col>
          <Col xs="5" className="text-right">
            {instanceDetails.instance_name}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs="7">
            Admin User
          </Col>
          <Col xs="5" className="text-right">
            {instanceDetails.user}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs="7">
            Admin Password
          </Col>
          <Col xs="5" className="text-right">
            {instanceDetails.pass}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs="7">
            Instance RAM
          </Col>
          <Col xs="5" className="text-right">
            {instanceSpecs.instance_ram}GB
          </Col>
        </Row>
        <hr />
        {instanceDetails.is_local ? (
          <Row>
            <Col xs="7">
              Uses SSL
            </Col>
            <Col xs="5" className="text-right">
              {instanceDetails.is_ssl.toString()}
            </Col>
          </Row>
        ) : (
          <>
            <Row>
              <Col xs="7">
                Instance Disk Space
              </Col>
              <Col xs="5" className="text-right">
                {instanceSpecs.instance_disk_space_gigs}GB
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs="7">
                Instance Region
              </Col>
              <Col xs="5" className="text-right">
                {instanceDetails.instance_region}
              </Col>
            </Row>
          </>
        )}
      </CardBody>
    </Card>
    <Button
      onClick={() => setConfirmed(true)}
      title="Confirm Instance Details"
      block
      className="mt-3"
      color="purple"
    >
      Confirm Instance Details
    </Button>
  </>
);
