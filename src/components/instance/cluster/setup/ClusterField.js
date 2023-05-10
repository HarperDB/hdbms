import React, { useState }  from 'react';
import { Row, Col, Input } from 'reactstrap';
import cn from 'classnames';
import FormValidationError from '../../../shared/FormValidationError';

function ClusterField({ label, value, type="text", max=null, min=null, editable=false, handleChange, validator=() => true, errorMessage=null }) {

  const [error, setError] = useState(null);

  return editable ? (
    <>
      <hr className="my-3" />
      <div className="text-nowrap mb-3">{`${label}`}</div>
      <Input
        id={`cluster-field-${label}`}
        type={type}
        className={cn('cluster-field', { error })}
        max={max}
        min={min}
        defaultValue={value}
        onChange={(e) => handleChange(e.target.value) }
        onBlur={(e) => {
          const isValid = validator(e.target.value);
          setError(isValid ? null : errorMessage);
        }}
        />
      <FormValidationError error={error} />
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

export default ClusterField;
