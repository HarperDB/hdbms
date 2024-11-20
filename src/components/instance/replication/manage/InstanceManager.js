import React, { useCallback } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import instanceState from '../../../../functions/state/instanceState';
import InstanceManagerRow from './InstanceManagerRow';
import addNode from '../../../../functions/api/instance/addNode';
import removeNode from '../../../../functions/api/instance/removeNode';
import clusterSetRoutes from '../../../../functions/api/instance/clusterSetRoutes';
import clusterDeleteRoutes from '../../../../functions/api/instance/clusterDeleteRoutes';
import restartService from '../../../../functions/api/instance/restartService';
function InstanceManager({
  items,
  itemType,
  setShowModal,
  loading,
  setLoading,
  refreshNetwork
}) {
  const {
    customerId
  } = useParams();
  const navigate = useNavigate();
  const alert = useAlert();
  const computeStackId = useStoreState(instanceState, s => s.computeStackId);
  const auth = useStoreState(instanceState, s => s.auth, [computeStackId]);
  const url = useStoreState(instanceState, s => s.url, [computeStackId]);
  const isLocal = useStoreState(instanceState, s => s.isLocal, [computeStackId]);
  const clusterEngine = useStoreState(instanceState, s => parseFloat(s.auth?.version) >= 4 ? 'nats' : 'socketcluster', [computeStackId]);
  const handleAddNode = useCallback(async payload => {
    setLoading(payload.computeStackId);
    const result = clusterEngine === 'nats' ? await clusterSetRoutes({
      auth,
      url,
      routes: [{
        host: payload.instanceHost,
        port: payload.clusterPort
      }]
    }) : await addNode({
      ...payload,
      auth,
      url,
      isLocal,
      customerId
    });
    if (result.error) {
      // TODO: review our policy about connecting to localhost instances.
      alert.error(payload.instanceHost === 'localhost' ? "External instances cannot reach that instance's URL" : result.message);
      setLoading(false);
    } else {
      if (clusterEngine === 'nats') {
        await restartService({
          auth,
          url,
          service: 'clustering config'
        });
      }
      await refreshNetwork();
    }
    setLoading(false);
  }, [setLoading, auth, url, isLocal, customerId, refreshNetwork, alert, clusterEngine]);
  const handleRemoveNode = useCallback(async payload => {
    setLoading(payload.computeStackId);
    const result = clusterEngine === 'nats' ? await clusterDeleteRoutes({
      auth,
      url,
      routes: [{
        host: payload.instanceHost,
        port: payload.clusterPort
      }]
    }) : await removeNode({
      ...payload,
      auth,
      url,
      isLocal,
      customerId
    });
    if (result.error) {
      alert.error(result.message);
      setLoading(false);
    } else {
      if (clusterEngine === 'nats') {
        await restartService({
          auth,
          url,
          service: 'clustering config'
        });
      }
      await refreshNetwork();
    }
    setLoading(false);
  }, [setLoading, auth, url, isLocal, customerId, refreshNetwork, alert, clusterEngine]);
  const handleConfigureNode = useCallback(payload => navigate(`/o/${customerId}/i/${payload.computeStackId}/cluster`), [navigate, customerId]);
  return <div className="entity-manager">
      <div className="floating-card-header">{itemType} instances</div>
      <Card className="my-3">
        <CardBody>
          {items?.length ? items.map(item => <InstanceManagerRow key={item.instanceName} item={item} itemType={itemType} setShowModal={setShowModal} handleAddNode={handleAddNode} handleRemoveNode={handleRemoveNode} handleConfigureNode={handleConfigureNode} loading={loading} refreshNetwork={refreshNetwork} />) : !items ? <Row className="item-row">
              <Col className="item-label">
                <i className="fa fa-spinner fa-spin" />
              </Col>
            </Row> : <Row className="item-row">
              <Col className="item-label">There are no {itemType} instances</Col>
            </Row>}
        </CardBody>
      </Card>
    </div>;
}
export default InstanceManager;