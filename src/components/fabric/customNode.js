import React, { Fragment } from 'react';
import { Col, Row } from '@nio/ui-kit';

export default (props, simpleStructure) => {
  const { node } = props;
  return (
    <div className="py-1 px-0 fabric-node">
      <b>{node.id}</b>
      <hr className="my-1" />
      <div className="node-scroller">
        {simpleStructure && Object.keys(simpleStructure).sort().map((schema) => (
          <div key={schema} className="text-smaller">
            <span>{schema}</span>
            <hr className="my-1" />
            {Object.keys(simpleStructure[schema]).sort().map((table) => (
              <Fragment key={`${schema}${table}`}>
                <Row>
                  <Col xs="6" className="text-left px-4">
                    {table}
                  </Col>
                  <Col xs="6" className="text-right px-4">
                    123
                  </Col>
                </Row>
                <hr className="my-1" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
