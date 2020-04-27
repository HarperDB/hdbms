import React from 'react';
import { Row, Col } from '@nio/ui-kit';

export default ({ items, itemType, toggleDropItem, isDropping, toggleCreate, isCreating, showForm }) => (
  <Row className="floating-card-header">
    <Col>{itemType}s</Col>
    {showForm && items && items.length ? (
      <Col className="text-right">
        <i
          title={`Remove ${itemType}s`}
          className="fa fa-minus text-white mr-2"
          onClick={() => {
            toggleDropItem(!isDropping);
            toggleCreate(false);
          }}
        />
        <i
          title={`Add ${itemType}`}
          className="fa fa-plus text-white"
          onClick={() => {
            toggleCreate(!isCreating);
            toggleDropItem(false);
          }}
        />
      </Col>
    ) : null}
  </Row>
);
