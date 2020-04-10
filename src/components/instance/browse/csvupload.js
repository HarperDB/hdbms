import React from 'react';
import { Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';
import { useStoreState } from 'pullstate';

import instanceState from '../../../state/instanceState';

import CSVUploadURL from './csvuploadURL';
import CSVUploadFile from './csvuploadFile';

export default () => {
  const history = useHistory();
  const { schema, table } = useParams();
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);

  return (
    <div id="csv-upload">
      <span className="text-white mb-2 floating-card-header">
        {schema} &gt; {table} &gt; csv upload
      </span>
      <Card className="my-3">
        <CardBody>
          <Row>
            <Col sm="6" className="mb-2">
              <CSVUploadURL />
            </Col>
            <Col sm="6">
              <CSVUploadFile />
            </Col>
          </Row>
          <hr className="mt-2 mb-4" />
          <Button block color="black" onClick={() => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}`)}>
            Cancel
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
