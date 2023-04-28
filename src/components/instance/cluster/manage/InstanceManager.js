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

function InstanceManager({ items, itemType, setShowModal, loading, setLoading, refreshNetwork }) {
  const { customer_id } = useParams();
  const navigate = useNavigate();
  const alert = useAlert();
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const auth = useStoreState(instanceState, (s) => s.auth, [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url, [compute_stack_id]);
  const is_local = useStoreState(instanceState, (s) => s.is_local, [compute_stack_id]);
  // FIXME: grabbing version from auth object is a temp fix.  something not updating right on instanceState parent object
  // when the compute_stack_id changes.
  const clusterEngine = useStoreState(instanceState, (s) => (parseFloat(s.auth?.version) >= 4 ? 'nats' : 'socketcluster'), [compute_stack_id]);

  console.log(items);
  const handleAddNode = useCallback(
    async (payload) => {
      setLoading(payload.compute_stack_id);
      if (payload.instance_host === 'localhost') {
        alert.error("External instances cannot reach that instance's URL");
      } else {
        // if you select an instance from instance dropdown that is a 3.x,
        // then switch to a 4.x, the clusterEngine value is wrong.
        //
        // Q: why do we call this at all? there is no subscription object, so we'll get a 400 for 3.x and 4.x.
        // const res2 = await addNode({ ...payload, auth, url, is_local, customer_id });
        const result = (clusterEngine === 'nats')
          ? await clusterSetRoutes({ auth, url, routes: [{ host: payload.instance_url, port: payload.clusterPort }] })
          : await addNode({ ...payload, auth, url, is_local, customer_id }); // why is this here? isn't this for pub/sub subscriptions?

        if (result.error) {
          // FIXME: adjust this in the near future: revise language? revise behavior? can multiple localhost instances
          // be clustered in dev? in prod?
          alert.error(payload.instance_host === 'localhost' ? "External instances cannot reach that instance's URL" : result.message);
          setLoading(false);
        } else {
          if (clusterEngine === 'nats') {
            await restartService({ auth, url, service: 'clustering config' });
          }
          await refreshNetwork();
        }
      }
      setLoading(false);
    },
    [setLoading, auth, url, is_local, customer_id, refreshNetwork, alert, clusterEngine]
  );

  const handleRemoveNode = useCallback(
    async (payload) => {
      setLoading(payload.compute_stack_id);
      const result =
        clusterEngine === 'nats'
          ? await clusterDeleteRoutes({ auth, url, routes: [{ host: payload.instance_host, port: payload.clusterPort }] })
          : await removeNode({ ...payload, auth, url, is_local, customer_id });
      if (result.error) {
        alert.error(result.message);
        setLoading(false);
      } else {
        if (clusterEngine === 'nats') {
          await restartService({ auth, url, service: 'clustering config' });
        }
        await refreshNetwork();
      }
      setLoading(false);
    },
    [setLoading, auth, url, is_local, customer_id, refreshNetwork, alert, clusterEngine]
  );

  const handleConfigureNode = useCallback((payload) => navigate(`/o/${customer_id}/i/${payload.compute_stack_id}/cluster`), [navigate, customer_id]);

  return (
    <div className="entity-manager">
      <div className="floating-card-header">{itemType} instances</div>
      <Card className="my-3">
        <CardBody>
          {items && items.length ? (
            items.map((item) => (
              <InstanceManagerRow
                key={item.instance_name}
                item={item}
                itemType={itemType}
                setShowModal={setShowModal}
                handleAddNode={handleAddNode}
                handleRemoveNode={handleRemoveNode}
                handleConfigureNode={handleConfigureNode}
                loading={loading}
                refreshNetwork={refreshNetwork}
              />
            ))
          ) : !items ? (
            <Row className="item-row">
              <Col className="item-label">
                <i className="fa fa-spinner fa-spin" />
              </Col>
            </Row>
          ) : (
            <Row className="item-row">
              <Col className="item-label">There are no {itemType} instances</Col>
            </Row>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default InstanceManager;
