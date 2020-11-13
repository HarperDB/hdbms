import React from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { useHistory, useParams } from 'react-router';

import CsvUploadURL from './CsvUploadURL';
import CsvUploadFile from './CsvUploadFile';

const CsvUpload = () => {
  const history = useHistory();
  const { schema, table, customer_id, compute_stack_id } = useParams();

  return (
    <div id="csv-upload">
      <span className="floating-card-header">
        {schema} &gt; {table} &gt; csv upload
      </span>
      <Card className="my-3">
        <CardBody>
          <CsvUploadURL />
          <hr className="my-3" />
          <CsvUploadFile />
          <hr className="my-3" />
          <Row>
            <Col xs="8" className="py-1">
              Return to Table
              <br />
              <span className="text-small">do not upload csv data</span>
            </Col>
            <Col xs="4">
              <Button id="returnToTable" block color="grey" onClick={() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`)}>
                Return to Table
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};
export default CsvUpload;
