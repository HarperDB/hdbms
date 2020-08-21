import React from 'react';
import { Row, Col, Button } from 'reactstrap';

export default ({ items, itemType, toggleDropItem, isDropping, toggleCreate, isCreating, showForm }) => (
  <Row className="floating-card-header">
    <Col>{items?.length ? `${itemType}s` : ''}&nbsp;</Col>
    {showForm && items?.length ? (
      <Col className="text-right">
        <Button
          color="link"
          title={`Remove ${itemType}s`}
          className="add-remove mr-3"
          onClick={() => {
            toggleDropItem(!isDropping);
            toggleCreate(false);
          }}
        >
          <i className="fa fa-minus" />
        </Button>
        <Button
          color="link"
          title={`Add ${itemType}`}
          className="add-remove mr-1"
          onClick={() => {
            toggleCreate(!isCreating);
            toggleDropItem(false);
          }}
        >
          <i className="fa fa-plus" />
        </Button>
      </Col>
    ) : null}
  </Row>
);
