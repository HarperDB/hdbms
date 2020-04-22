import React from 'react';
import { Card, CardBody, Row, Col, Button } from '@nio/ui-kit';

export default ({ icon, name, docs, urls }) => (
  <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
    <Card>
      <CardBody className="text-center">
        <i className={`fa fa-2x fa-${icon} text-purple`} />
        <b className="d-block mt-3 mb-1">{name}</b>
        <a className="d-block mb-3" href={`http://cdn.cdata.com/help/FHD/${docs}/default.htm`} target="_blank" rel="noopener noreferrer">
          documentation
        </a>
        <Row>
          {urls.map((u) => (
            <Col key={u.link}>
              <Button href={u.link} block color="purple">
                {u.label || 'Download'}
              </Button>
            </Col>
          ))}
        </Row>
      </CardBody>
    </Card>
  </Col>
);
