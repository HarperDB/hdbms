import React from 'react';
import { Row, Col, Button } from 'reactstrap';

const EntityManagerHeader = ({ items, toggleDropItem, isDropping, toggleCreate, isCreating }) => (
  <Row className="floating-card-header">
    <Col>endpoints</Col>
    {items?.length ? (
      <Col className="text-right">
        <Button
          id="toggleRemove"
          color="link"
          title="Remove Functions"
          className="add-remove mr-3"
          onClick={() => {
            toggleDropItem(!isDropping);
            toggleCreate(false);
          }}
        >
          <i className="fa fa-minus" />
        </Button>
        <Button
          id="toggleCreate"
          color="link"
          title="Add Function"
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

export default EntityManagerHeader;
