import React, { useState } from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useHistory } from 'react-router';

import instanceState from '../../../state/stores/instanceState';
import removeNode from '../../../api/instance/removeNode';
import addNode from '../../../api/instance/addNode';

export default ({ item: { instance_name, instance_host, instance_status, connection, clusterPort, reachable }, itemType }) => {
  const history = useHistory();
  const [changing, setChanging] = useState(false);
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));

  return (
    <Row className="item-row">
      <Col className="text-nowrap text-truncate pt-1">{instance_name}</Col>
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
                  instance_name,
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
        ) : !reachable ? (
          <Button color="grey" className="round" title="Unreachable Domain" disabled>
            <i className="fa fa-exclamation text-white" />
          </Button>
        ) : connection ? (
          <Button
            color="danger"
            className="round"
            title="Disconnect From This Instance"
            disabled={changing}
            onClick={() => {
              setChanging(true);
              removeNode({
                instance_name,
                auth,
                url,
              });
            }}
          >
            <i className={`fa ${changing ? 'fa-spin fa-spinner' : 'fa-minus'} text-white`} />
          </Button>
        ) : (
          <Button
            color="success"
            className="round"
            title="Connect To This Instance"
            disabled={changing}
            onClick={() => {
              setChanging(true);
              addNode({
                instance_name,
                instance_host,
                clusterPort,
                auth,
                url,
              });
            }}
          >
            <i className={`fa ${changing ? 'fa-spin fa-spinner' : 'fa-plus'} text-white`} />
          </Button>
        )}
      </Col>
    </Row>
  );
};
