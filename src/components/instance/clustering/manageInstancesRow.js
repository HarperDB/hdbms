import React, { useState } from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useHistory } from 'react-router';

import instanceState from '../../../state/stores/instanceState';
import removeNode from '../../../api/instance/removeNode';
import addNode from '../../../api/instance/addNode';

export default ({ setShowModal, item: { compute_stack_id, instance_name, instance_host, instance_status, connection, clusterPort }, itemType }) => {
  const history = useHistory();
  const [changing, setChanging] = useState(false);
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));

  return (
    <Row className="item-row">
      <Col className={`text-nowrap text-truncate pt-1 ${connection?.state === 'closed' ? 'text-danger' : ''}`}>{instance_name}</Col>
      <Col className="item-action text-right">
        {itemType === 'unregistered' ? (
          <>
            <Button color="success" className="round mr-1" title="Add Instance To Studio" onClick={() => history.push('/instances/new')}>
              <i className="fa fa-plus text-white" />
            </Button>
            <Button
              color="danger"
              className="round"
              title="Remove Instance From Cluster Config"
              disabled={changing}
              onClick={() => {
                setChanging(true);
                removeNode({
                  compute_stack_id,
                  auth,
                  url,
                });
              }}
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
            onClick={() => {
              setChanging(true);
              addNode({
                compute_stack_id,
                instance_host,
                clusterPort,
                auth,
                url,
              });
            }}
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
              onClick={() => {
                setChanging(true);
                removeNode({
                  compute_stack_id,
                  auth,
                  url,
                });
              }}
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
            onClick={() => {
              setChanging(true);
              removeNode({
                compute_stack_id,
                auth,
                url,
              });
            }}
          >
            <i className={`fa ${changing || connection?.state === 'connecting' ? 'fa-spin fa-spinner' : 'fa-minus'} text-white`} />
          </Button>
        )}
      </Col>
    </Row>
  );
};
