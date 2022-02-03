import React from 'react';
import { useHistory, useParams } from 'react-router';
import { Card, CardBody, Col } from 'reactstrap';
import { useStoreState } from 'pullstate';
import appState from '../../../functions/state/appState';

function NewInstanceCard() {
  const history = useHistory();
  const { customer_id } = useParams();
  const is_lumen = useStoreState(appState, (s) => s.is_lumen);

  const handleClick = () => {
    if (window._kmq) window._kmq.push(['record', 'clicked new instance card']);
    history.push(`/o/${customer_id}/instances/new`);
  };

  return (
    <Col xs="12" md="6" lg="4" xl="3" className="mb-4">
      <Card tabIndex="0" id="newInstanceCard" title="Add New Instance" className="instance new" onKeyDown={(e) => e.keyCode !== 13 || handleClick()} onClick={handleClick}>
        <CardBody className="d-flex flex-column align-items-center justify-content-center">
          <span>Create New {is_lumen ? 'Lumen Edge HarperDB' : 'HarperDB Cloud'} Instance</span>
          <div className="my-4">
            <i className="fa fa-2x fa-plus-circle new-instance-plus" />
          </div>
          <span>Register User-Installed Instance</span>
        </CardBody>
      </Card>
    </Col>
  );
}

export default NewInstanceCard;
