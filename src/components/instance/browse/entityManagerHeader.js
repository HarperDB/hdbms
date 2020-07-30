import React from 'react';
import { Row, Col } from 'reactstrap';

export default ({ items, itemType, toggleDropItem, isDropping, toggleCreate, isCreating, showForm }) => (
  <Row className="floating-card-header">
    <Col>{itemType}s</Col>
    {showForm && items && items.length ? (
      <Col className="text-right">
        <i
          aria-label={`Remove ${itemType}s`}
          tabIndex="0"
          role="button"
          title={`Remove ${itemType}s`}
          className="add-remove fa fa-minus mr-2"
          onClick={() => {
            toggleDropItem(!isDropping);
            toggleCreate(false);
          }}
        />
        <i
          aria-label={`Add ${itemType}`}
          tabIndex="0"
          role="button"
          title={`Add ${itemType}`}
          className="add-remove fa fa-plus"
          onClick={() => {
            toggleCreate(!isCreating);
            toggleDropItem(false);
          }}
        />
      </Col>
    ) : null}
  </Row>
);
