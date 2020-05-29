import React from 'react';
import { useHistory } from 'react-router';
import { Card, CardBody, Col } from '@nio/ui-kit';

const NewOrgCard = () => {
  const history = useHistory();

  return (
    <Col xs="12" md="6" lg="4" xl="3" className="mb-4">
      <Card
        tabIndex="0"
        id="newOrgCard"
        title="Add New Organization"
        className="instance new"
        onKeyDown={(e) => e.keyCode !== 13 || history.push(`/organizations/new`)}
        onClick={() => history.push(`/organizations/new`)}
      >
        <CardBody className="d-flex flex-column align-items-center justify-content-center">
          <span>Create A New Organization</span>
          <div className="my-4">
            <i className="fa fa-2x fa-plus-circle new-org-plus" />
          </div>
          <span>With Its Own Instances And Billing</span>
        </CardBody>
      </Card>
    </Col>
  );
};

export default NewOrgCard;