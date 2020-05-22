import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default ({ header, body, spinner, links = false }) => (
  <>
    <Card className="mb-3">
      <CardBody className="text-white text-center">
        <div className="mb-3">{header}</div>
        {spinner && <i className="fa fa-spinner fa-spin text-white" />}
        {body}
      </CardBody>
    </Card>
    {!links ? (
      <div className="login-nav-link">&nbsp;</div>
    ) : (
      <Row>
        {links.map((link) => (
          <Col>
            <NavLink to={link.to} className={`login-nav-link ${links.length === 1 ? 'text-center' : ''}`}>
              {link.text}
            </NavLink>
          </Col>
        ))}
      </Row>
    )}
  </>
);
