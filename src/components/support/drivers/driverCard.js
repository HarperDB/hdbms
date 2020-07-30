import React from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default ({ icon, name, docs, urls }) => (
  <Col lg="3" md="4" sm="6" xs="12" className="mb-3">
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <Card>
        <CardBody className="text-center">
          <i className={`fa fa-2x fa-${icon} text-purple`} />
          <b className="d-block mt-3 mb-2">{name}</b>
          <a className="d-block mb-3 text-small" href={docs ? `http://cdn.cdata.com/help/FHE/${docs}/default.htm` : urls[0].link} target="_blank" rel="noopener noreferrer">
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
    </ErrorBoundary>
  </Col>
);
