import { Col, Row } from '@nio/ui-kit';
import React from 'react';

export default ({ which, compute, storage, total }) => (
  <>
    <hr className="mt-3 mb-1" />
    <Row>
      <Col xs="6">
        Compute
        {which === 'compute' && '(new)'}
      </Col>
      <Col xs="6" className="text-right">
        {compute}
      </Col>
      <Col xs="12">
        <hr className="my-1" />
      </Col>
    </Row>
    <Row>
      <Col xs="6">
        Storage
        {which === 'storage' && '(new)'}
      </Col>
      <Col xs="6" className="text-right">
        {storage}
      </Col>
      <Col xs="12">
        <hr className="my-1" />
      </Col>
    </Row>
    <Row>
      <Col xs="6">
        <b>New Total</b>
      </Col>
      <Col xs="6" className="text-right">
        <b>{total}</b>
      </Col>
      <Col xs="12">
        <hr className="mt-1 mb-3" />
      </Col>
    </Row>
  </>
);
