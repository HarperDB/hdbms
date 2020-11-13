import React from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';

const DbMigratorCard = ({ icon, name, urls }) => (
  <Col lg="4" xs="12" className="mb-3">
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <Card className="integration-driver-card">
        <CardBody className="pt-3">
          <b className="d-block">{name}</b>
          <i className={`card-icon fa fa-lg fa-${icon} text-darkgrey`} />
          <hr className="my-3" />
          <Row>
            {urls.map((u) => (
              <Col key={u.link}>
                <Button id={name} href={u.link} block color="purple">
                  {u.label || 'Download'}
                </Button>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </ErrorBoundary>
  </Col>
);

export default DbMigratorCard;
