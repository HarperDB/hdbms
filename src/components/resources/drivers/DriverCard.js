import React from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';

function DriverCard({ icon, name, docs, urls }) {
  return <Col xl="4" lg="6" xs="12" className="mb-3">
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <Card className="integration-driver-card">
        <CardBody className="pt-3">
          <b className="d-block">{name}</b>
          <div className="d-block text-small text-truncate mt-1">
            docs:{' '}
            <a className="text-darkgrey" href={docs ? `http://cdn.cdata.com/help/FHG/${docs}` : urls[0].link} target="_blank" rel="noopener noreferrer">
              {docs ? `http://cdn.cdata.com/help/FHG/${docs}` : urls[0].link}
            </a>
          </div>
          <i className={`card-icon fa fa-lg fa-${icon} text-darkgrey`} />
          <hr className="my-3" />
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
}

export default DriverCard;
