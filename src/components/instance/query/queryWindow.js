import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, CardBody, Card } from '@nio/ui-kit';

import handleKeydown from '../../../methods/util/handleKeydown';

export default ({ setQuery, query }) => {
  const [formData, setFormData] = useState('');
  const [formState, setFormState] = useState(false);

  useEffect(() => {
    if (query) {
      setFormState({ submitted: false });
      setFormData(query.query || query);
    }
  }, [query]);

  useEffect(() => {
    if (formState.submitted && formData.length) {
      setQuery({ lastUpdate: Date.now(), query: formData });
      setFormData(formData.trim());
      setFormState({ submitted: false });
    }
  }, [formState]);

  return (
    <div id="query-window">
      <span className="floating-card-header">sql query</span>
      <Card className="mt-3 mb-4">
        <CardBody>
          <Input
            type="textarea"
            className="sql-query-textarea"
            value={formData}
            onKeyDown={(e) => handleKeydown(e, setFormState, true)}
            onChange={(e) => setFormData(e.target.value)}
          />
          <Row>
            <Col>
              <Button
                color="grey"
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
              <Button color="success" block className="mt-2" onClick={() => setFormState({ submitted: true })}>
                Execute
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};
