import React from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { useHistory, useParams } from 'react-router';

import CSVUploadURL from './csvuploadURL';
import CSVUploadFile from './csvuploadFile';

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
          <CSVUploadURL />
          <hr className="my-3" />
          <CSVUploadFile />
          <hr className="my-3" />
          <Row>
            <Col xs="8" className="py-1">
              Return to Table
              <br />
              <span className="text-small">do not upload csv data</span>
            </Col>
            <Col xs="4">
              <Button block color="grey" onClick={() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`)}>
                Return to Table
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};
