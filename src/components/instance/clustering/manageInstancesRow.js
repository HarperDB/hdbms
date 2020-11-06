import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';

import instanceState from '../../../functions/state/instanceState';
import removeNode from '../../../functions/api/instance/removeNode';
import addNode from '../../../functions/api/instance/addNode';

const ManageInstancesRow = ({ setShowModal, item: { compute_stack_id, instance_name, instance_host, instance_status, connection, clusterPort }, itemType }) => {
  const { customer_id } = useParams();
  const history = useHistory();
  const alert = useAlert();
  const [changing, setChanging] = useState(false);
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);

  const handleAddNode = async (payload) => {
    setChanging(true);
    const result = await addNode(payload);
    if (result.error) {
      alert.error(instance_host === 'localhost' ? "External instances cannot reach that instance's URL" : result.message);
      setChanging(false);
    } else {
      instanceState.update((s) => {
        s.lastUpdate = Date.now();
      });
    }
  };

  const handleRemoveNode = async (payload) => {
    setChanging(true);
    const result = await removeNode(payload);
    if (result.error) {
      alert.error(result.message);
      setChanging(false);
    } else {
      instanceState.update((s) => {
        s.lastUpdate = Date.now();
      });
    }
  };

  return (
    <Row className="item-row">
      <Col className={`item-label ${connection?.state === 'closed' ? 'text-danger' : ''}`}>{instance_name}</Col>
      <Col className="item-action">
        {itemType === 'unregistered' ? (
          <>
            <Button color="success" className="round mr-1" title="Add Instance To Studio" onClick={() => history.push(`/o/${customer_id}/instances/new`)}>
              <i className="fa fa-plus text-white" />
            </Button>
            <Button
              color="danger"
              className="round"
              title="Remove Instance From Cluster Config"
              disabled={changing}
              onClick={() =>
                handleRemoveNode({
                  compute_stack_id,
                  auth,
                  url,
                  is_local,
                  customer_id,
                })
              }
            >
              <i className={`fa ${changing ? 'fa-spin fa-spinner' : 'fa-times'} text-white`} />
            </Button>
          </>
        ) : instance_status === 'CREATE_IN_PROGRESS' ? (
          <Button color="grey" className="round" title="Creating Instance" disabled>
            <i className="fa fa-spin fa-spinner" />
          </Button>
        ) : !connection ? (
          <Button
            color="purple"
            className="round"
            title="Connect To This Instance"
            disabled={changing}
            onClick={() =>
              handleAddNode({
                compute_stack_id,
                instance_host,
                clusterPort,
                auth,
                url,
                is_local,
                customer_id,
              })
            }
          >
            <i className={`fa ${changing ? 'fa-spin fa-spinner' : 'fa-plus'} text-white`} />
          </Button>
        ) : connection?.state === 'closed' ? (
          <>
            <Button color="danger" className="round mr-1" title="Why isn't this instance clustering?" disabled={changing} onClick={() => setShowModal(instance_name)}>
              <i className="fa fa-exclamation" />
            </Button>
            <Button
              color="purple"
              className="round"
              title="Disconnect From This Instance"
              disabled={changing}
              onClick={() =>
                handleRemoveNode({
                  compute_stack_id,
                  auth,
                  url,
                  is_local,
                  customer_id,
                })
              }
            >
              <i className={`fa ${changing ? 'fa-spin fa-spinner' : 'fa-minus'} text-white`} />
            </Button>
          </>
        ) : (
          <Button
            color="purple"
            className="round"
            title="Disconnect From This Instance"
            disabled={changing}
            onClick={() =>
              handleRemoveNode({
                compute_stack_id,
                auth,
                url,
                is_local,
                customer_id,
              })
            }
          >
            <i className={`fa ${changing || connection?.state === 'connecting' ? 'fa-spin fa-spinner' : 'fa-minus'} text-white`} />
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default ManageInstancesRow;
