import React from 'react';
import { useHistory } from 'react-router';
import { Card, CardBody, Col } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import appState from '../../../state/appState';

const NewInstanceCard = () => {
  const history = useHistory();
  const customer_id = useStoreState(appState, (s) => s.customer?.customer_id);

  return (
    <Col xs="12" md="6" lg="4" xl="3" className="mb-4">
      <Card
        tabIndex="0"
        id="newInstanceCard"
        title="Add New Instance"
        className="instance new"
        onKeyDown={(e) => e.keyCode !== 13 || history.push(`/${customer_id}/instances/new`)}
        onClick={() => history.push(`/${customer_id}/instances/new`)}
      >
        <CardBody className="d-flex flex-column align-items-center justify-content-center">
          <span>Create New HarperDB Cloud Instance</span>
          <div className="my-4">
            <i className="fa fa-2x fa-plus-circle new-instance-plus" />
          </div>
          <span>Import Existing HarperDB Instance</span>
        </CardBody>
      </Card>
    </Col>
  );
};

export default NewInstanceCard;
