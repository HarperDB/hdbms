import React from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

export default ({ details }) => (
  <>
    <span className="text-white mb-2">instance details</span>
    <Card className="my-3">
      <CardBody>
        { details ? (
          <>
            <Row>
              <Col xs="6">
                HarperDB Cloud<sup>&reg;</sup>
              </Col>
              <Col md="6" xs="12">
                {details.is_local ? 'no' : 'yes'}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs="6">
                Product ID
              </Col>
              <Col md="6" xs="12">
                {details.stripe_product_id}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs="6">
                Instance Status
              </Col>
              <Col md="6" xs="12">
                {details.status}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs="6">
                Instance Name
              </Col>
              <Col md="6" xs="12">
                {details.instance_name}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs="6">
                Instance URL
              </Col>
              <Col md="6" xs="12">
                {`http${details.domain_name || details.is_ssl ? 's' : ''}://${details.domain_name || details.host}:${details.port}`}
              </Col>
            </Row>
            {details.instance_region && (
              <>
                <hr />
                <Row>
                  <Col xs="6">
                    AWS Region
                  </Col>
                  <Col md="6" xs="12">
                    {details.instance_region}
                  </Col>
                </Row>
              </>
            )}
            <hr />
            <Row>
              <Col xs="6">
                RAM Allotment
              </Col>
              <Col md="6" xs="12">
                {details.instance_ram}GB
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs="6">
                Disk Space
              </Col>
              <Col md="6" xs="12">
                {details.instance_disk_space_gigs}GB
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs="6">
                Cost
              </Col>
              <Col md="6" xs="12">
                ${details.is_local ? `${details.local_price_annual}/year` : `${details.cloud_price_monthly}/month`}
              </Col>
            </Row>
            {details.local_price_annual ? (
              <>
                <hr />
                <Row>
                  <Col xs="6">
                    Next Charge Date
                  </Col>
                  <Col md="6" xs="12">
                    {details.exp_date ? new Date(details.exp_date).toLocaleDateString() : ''}
                  </Col>
                </Row>
              </>
            ) : null}
          </>
        ) : (
          <i className="fa fa-spinner fa-spin text-purple" />
        )}
      </CardBody>
    </Card>
  </>
);
