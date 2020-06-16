import React, { useState } from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import queryInstance from '../../../api/queryInstance';
import instanceState from '../../../state/instanceState';

export default ({ item, itemType, baseUrl, isActive, toggleDropItem, isDropping, activeSchema }) => {
  const history = useHistory();
  const alert = useAlert();
  const [isConfirmingDropItem, toggleConfirmDropItem] = useState(false);
  const [confirmedDropItem, setConfirmedDropItem] = useState(false);
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);

  const handleDropItem = async () => {
    if (!itemType || !isConfirmingDropItem) return false;

    const operation = {
      operation: `drop_${itemType}`,
    };

    if (itemType === 'table') {
      operation.schema = activeSchema;
      operation.table = item;
    } else {
      operation.schema = item;
    }

    const result = await queryInstance(operation, auth, url);

    if (result.error) {
      return alert.error(result.error);
    }

    return instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
  };

  const selectItemForDrop = () => {
    toggleConfirmDropItem(item);
    toggleDropItem(false);
  };

  const confirmItemForDrop = () => {
    toggleConfirmDropItem(false);
    setConfirmedDropItem(true);
    handleDropItem(item);
  };

  const cancelConfirmDrop = () => {
    toggleConfirmDropItem(false);
  };

  const handleSetActive = () => (isActive || isDropping || isConfirmingDropItem ? false : history.push(`${baseUrl}/${item}`));

  return (
    <Row key={item} title={`View${isActive ? 'ing' : ''} ${itemType} ${item}`} className={`item-row ${isActive ? 'active' : ''}`} onClick={handleSetActive} tabIndex="0">
      <Col className={`item-label ${isConfirmingDropItem ? 'text-danger text-nowrap' : ''}`}>{isConfirmingDropItem ? `drop ${item}?` : item}</Col>
      <Col className="item-action">
        {confirmedDropItem ? (
          <Button tabIndex="-1" disabled color="purple" className="round">
            <i className="fa fa-spinner fa-spin" />
          </Button>
        ) : isConfirmingDropItem ? (
          <>
            <Button color="danger" className="round mr-1" title={`confirm drop ${itemType} ${item}`} onClick={confirmItemForDrop}>
              <i className="fa fa-check text-white" />
            </Button>
            <Button color="black" className="round" title={`Cancel drop ${itemType} ${item}`} onClick={cancelConfirmDrop}>
              <i className="fa fa-times text-white" />
            </Button>
          </>
        ) : isDropping ? (
          <Button color="danger" className="round" title={`Drop ${itemType} ${item}`} onClick={selectItemForDrop}>
            <i className="fa fa-minus text-white" />
          </Button>
        ) : isActive ? (
          <Button tabIndex="-1" color="purple" className="round">
            <i className="fa fa-chevron-right" />
          </Button>
        ) : null}
      </Col>
    </Row>
  );
};
