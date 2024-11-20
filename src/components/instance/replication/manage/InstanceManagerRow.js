import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import ActionNoConnection from './ActionNoConnection';
import ActionConnectionClosed from './ActionConnectionClosed';
import ActionConnectionOpen from './ActionConnectionOpen';
import ActionConnecting from './ActionConnecting';
import ActionUnconfigured from './ActionUnconfigured';
function InstanceManagerRow({
  setShowModal,
  item,
  itemType,
  loading,
  handleAddNode,
  handleRemoveNode,
  handleConfigureNode,
  refreshNetwork
}) {
  const isLoading = item.computeStackId === loading;
  return <Row className="item-row">
      <Col className={`item-label ${item.connection?.state === 'closed' ? 'text-danger' : ''}`}>{item.instanceName}</Col>
      <Col className="item-action">
        {itemType === 'incompatible/unreachable' ? null : itemType === 'unconfigured' ? <ActionUnconfigured loading={isLoading} handleConfigureNode={() => handleConfigureNode({
        computeStackId: item.computeStackId
      })} /> : item.instanceStatus === 'CREATE_IN_PROGRESS' ? <Button color="grey" className="round" title="Creating Instance" disabled>
            <i className="fa fa-spin fa-spinner" />
          </Button> : !item.connection ? <ActionNoConnection loading={isLoading} handleAddNode={() => handleAddNode({
        computeStackId: item.computeStackId,
        instanceUrl: item.instanceUrl,
        instanceHost: item.instanceHost,
        clusterPort: item.clusterPort
      })} /> : item.connection?.state === 'closed' ? <ActionConnectionClosed loading={isLoading} handleRemoveNode={() => handleRemoveNode({
        computeStackId: item.computeStackId
      })} showModal={() => setShowModal(item.instanceName)} /> : item.connection?.state === 'connecting' ? <ActionConnecting refreshNetwork={refreshNetwork} /> : <ActionConnectionOpen loading={isLoading} handleRemoveNode={() => handleRemoveNode({
        computeStackId: item.computeStackId,
        instanceHost: item.instanceHost,
        clusterPort: item.clusterPort
      })} />}
      </Col>
    </Row>;
}
export default InstanceManagerRow;