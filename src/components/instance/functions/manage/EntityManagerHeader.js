import React from 'react';
import { Row, Col, Button } from 'reactstrap';

const EntityManagerHeader = ({ items, toggleDropItem, isDropping, toggleCreate, project, isCreating, restarting, itemType }) => (
  <Row className="floating-card-header">
    <Col>{itemType === 'routes' ? `routes in /${project}` : itemType === 'helpers' ? `helpers for ${project}` : 'projects (route prefixes)'}</Col>

    {items?.length ? (
      <Col className="text-end">
        <Button
          disabled={restarting}
          id="toggleRemove"
          color="link"
          title="Remove Functions"
          className="add-remove me-3"
          onClick={() => {
            toggleDropItem(!isDropping);
            toggleCreate(false);
          }}
        >
          <i className="fa fa-minus" />
        </Button>
        <Button
          disabled={restarting}
          id="toggleCreate"
          color="link"
          title="Add Function"
          className="add-remove me-1"
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
