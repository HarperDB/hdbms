import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Input, Button } from 'reactstrap';

function ClusterFormInput({ label, value, editable=false, updateFn, error }) {

  const [inputValue, setInputValue] = useState(value);

  return editable ? (
    <>
      <hr className="my-3" />
      <div className="text-nowrap mb-3">{`Set ${label}`}</div>
      <Input
        id={`clustering-${label}`}
        type="text"
        defaultValue={value}
        onChange={(e) => setInputValue(e.target.value) } />
      <Button
        block
        color="success"
        onClick={(e) => updateFn(inputValue) }>
        {`Set ${label}`}
      </Button>
      <Row>
        <Col xs="10" className="text">{label}: {value}</Col>
        <Col xs="2" className="text text-end">
          <i className="fa fa-check-circle fa-lg text-success" />
        </Col>
      </Row>
    </>
  ) : (
    <Row>
      <Col xs="12">
        <hr className="my-3" />
      </Col>
      <Col xs="10" className="text">
      { `${label}: ${value}` }
      </Col>
      <Col xs="2" className="text text-end">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  );

}

export default ClusterFormInput;
