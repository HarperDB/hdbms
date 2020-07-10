import React, { useState, useEffect, createRef } from 'react';
import { Input, Button, Row, Col, CardBody, Card } from '@nio/ui-kit';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default ({ setQuery, query }) => {
  const { compute_stack_id, customer_id } = useParams();
  const [formData, setFormData] = useState('');
  const [formState, setFormState] = useState(false);
  const submitRef = createRef();

  useEffect(() => {
    if (query) {
      setFormState({ submitted: false });
      setFormData(query.query || query);
      submitRef.current.focus();
    }
  }, [query]);

  useEffect(() => {
    const temp = formData;
    const detabbed = temp.length ? temp.replace(/[\t\n\r]/gm, '') : '';

    if (formState.submitted && detabbed.length) {
      setQuery({ lastUpdate: Date.now(), query: formData.trim() });
      setFormData(formData.trim());
      setFormState({ submitted: false });
    } else if (formState.submitted) {
      setFormData('');
      setFormState({ submitted: false });
    }
  }, [formState]);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <div id="query-window">
        <span className="floating-card-header">sql query</span>
        <Card className="mt-3 mb-4">
          <CardBody>
            <Input
              type="textarea"
              className="sql-query-textarea"
              value={formData}
              onKeyDown={(e) => {
                if (e.keyCode === 13 && e.metaKey) {
                  setFormState({ submitted: true });
                } else if (e.keyCode === 9) {
                  e.preventDefault();
                  document.execCommand('insertHTML', false, '&#009');
                }
              }}
              onChange={(e) => setFormData(e.target.value)}
            />
            <Row>
              <Col>
                <Button
                  color="grey"
                  title="clear query"
                  block
                  className="mt-2"
                  onClick={() => {
                    setQuery(false);
                    setFormData('');
                  }}
                >
                  Clear
                </Button>
              </Col>
              <Col>
                <Button innerRef={submitRef} title="execute query" color="purple" block className="mt-2" onClick={() => setFormState({ submitted: true })}>
                  Execute
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </ErrorBoundary>
  );
};
