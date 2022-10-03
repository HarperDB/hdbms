import React from 'react';
import { Row, Col, Button } from 'reactstrap';

import ActionNoConnection from './ActionNoConnection';
import ActionConnectionClosed from './ActionConnectionClosed';
import ActionConnectionOpen from './ActionConnectionOpen';
import ActionConnecting from './ActionConnecting';

function InstanceManagerRow({ setShowModal, item, itemType, loading, handleAddNode, handleRemoveNode, refreshNetwork }) {
  return (
    <Row className="item-row">
      <Col className={`item-label ${item.connection?.state === 'closed' ? 'text-danger' : ''}`}>{item.instance_name}</Col>
      <Col className="item-action">
        {itemType === 'unreachable' ? null
          : item.instance_status === 'CREATE_IN_PROGRESS' ? (
          <Button color="grey" className="round" title="Creating Instance" disabled>
            <i className="fa fa-spin fa-spinner" />
          </Button>
        ) : !item.connection ? (
          <ActionNoConnection
            loading={loading === item.compute_stack_id}
            handleAddNode={() =>
              handleAddNode({
                compute_stack_id: item.compute_stack_id,
                instance_host: item.instance_host,
                clusterPort: item.clusterPort,
              })
            }
          />
        ) : item.connection?.state === 'closed' ? (
          <ActionConnectionClosed
            loading={loading === item.compute_stack_id}
            handleRemoveNode={() => handleRemoveNode({ compute_stack_id: item.compute_stack_id })}
            showModal={() => setShowModal(item.instance_name)}
          />
        ) : item.connection?.state === 'connecting' ? (
          <ActionConnecting refreshNetwork={refreshNetwork} />
        ) : (
          <ActionConnectionOpen loading={loading === item.compute_stack_id} handleRemoveNode={() => handleRemoveNode({ compute_stack_id: item.compute_stack_id })} />
        )}
      </Col>
    </Row>
  );
}

export default InstanceManagerRow;
