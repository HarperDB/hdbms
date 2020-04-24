import React, { useState } from 'react';
import { Input, Button, Row, Col, CardBody, Card } from '@nio/ui-kit';

export default ({ setQuery }) => {
  const [formData, setFormData] = useState('');

  return (
    <div id="query-window">
      <span className="text-white floating-card-header">sql query</span>
      <Card className="mt-3 mb-4">
        <CardBody>
          <Input type="textarea" className="sql-query-textarea" value={formData} onChange={(e) => setFormData(e.target.value)} />
          <Row>
            <Col>
              <Button
                color="grey"
                block
                className="mt-2"
                onClick={() => {
                  setFormData('');
                  setQuery(false);
                }}
              >
                Clear
              </Button>
            </Col>
            <Col>
              <Button color="success" block className="mt-2" onClick={() => setQuery({ lastUpdate: Date.now(), query: formData })}>
                Execute
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};
