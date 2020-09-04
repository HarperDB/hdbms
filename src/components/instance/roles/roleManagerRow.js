import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import { useAlert } from 'react-alert';
import instanceState from '../../../state/instanceState';

import dropRole from '../../../api/instance/dropRole';

export default ({ item, baseUrl, isActive, toggleDropItem, isDropping }) => {
  const { compute_stack_id, customer_id } = useParams();
  const history = useHistory();
  const alert = useAlert();
  const [isConfirmingDropItem, toggleConfirmDropItem] = useState(false);
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);

  const handleDropItem = async () => {
    if (!isConfirmingDropItem) return false;

    const result = await dropRole({ auth, url, id: item.id, is_local, compute_stack_id, customer_id });

    if (result.error) {
      return alert.error(result.message);
    }

    instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });

    return isActive ? setTimeout(() => history.push(baseUrl), 100) : false;
  };

  const selectItemForDrop = () => {
    toggleConfirmDropItem(item);
    toggleDropItem(false);
  };

  const confirmItemForDrop = () => {
    toggleConfirmDropItem(false);
    handleDropItem();
  };

  const cancelConfirmDrop = () => {
    toggleConfirmDropItem(false);
  };

  const handleSetActive = () => (isActive || isDropping || isConfirmingDropItem ? false : history.push(`${baseUrl}/${item.id}`));

  return (
    <Row key={item} className={`item-row ${isActive ? 'active' : ''}`} onClick={handleSetActive}>
      <Col className={`item-label ${isConfirmingDropItem ? 'text-danger text-nowrap' : ''}`}>{isConfirmingDropItem ? `drop ${item.role}?` : item.role}</Col>
      <Col className="item-action">
        {isConfirmingDropItem ? (
          <>
            <Button id="confirmDropRole" color="danger" className="round mr-1" title={`confirm drop ${item.role}`} onClick={confirmItemForDrop}>
              <i className="fa fa-check text-white" />
            </Button>
            <Button color="black" className="round" title={`Cancel drop ${item.role}`} onClick={cancelConfirmDrop}>
              <i className="fa fa-times text-white" />
            </Button>
          </>
        ) : isDropping ? (
          <Button id={`drop${item.role}`} color="danger" className="round" title={`Drop ${item.role}`} onClick={selectItemForDrop}>
            <i className="fa fa-minus text-white" />
          </Button>
        ) : isActive ? (
          <Button color="purple" className="round" title={`Viewing ${item.role}`}>
            <i className="fa fa-chevron-right" />
          </Button>
        ) : null}
      </Col>
    </Row>
  );
};
