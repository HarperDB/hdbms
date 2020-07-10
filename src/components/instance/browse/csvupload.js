import React from 'react';
import { Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import CSVUploadURL from './csvuploadURL';
import CSVUploadFile from './csvuploadFile';
import addError from '../../../api/lms/addError';
import ErrorFallback from '../../shared/errorFallback';

export default () => {
  const history = useHistory();
  const { schema, table, customer_id, compute_stack_id } = useParams();

  return (
    <div id="csv-upload">
      <span className="floating-card-header">
        {schema} &gt; {table} &gt; csv upload
      </span>
      <Card className="my-3">
        <CardBody>
          <Row>
            <Col sm="6" className="mb-2">
              <ErrorBoundary
                onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
                FallbackComponent={ErrorFallback}
              >
                <CSVUploadURL />
              </ErrorBoundary>
            </Col>
            <Col sm="6">
              <ErrorBoundary
                onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
                FallbackComponent={ErrorFallback}
              >
                <CSVUploadFile />
              </ErrorBoundary>
            </Col>
          </Row>
          <hr className="mt-2 mb-4" />
          <Button block color="black" onClick={() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`)}>
            Cancel
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
