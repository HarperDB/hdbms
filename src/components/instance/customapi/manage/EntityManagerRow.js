import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import queryInstance from '../../../../functions/api/queryInstance';
import instanceState from '../../../../functions/state/instanceState';
import buildCustomAPI from '../../../../functions/instance/buildCustomAPI';

const EntityManagerRow = ({ item, baseUrl, isActive, toggleDropItem, isDropping }) => {
  const history = useHistory();
  const alert = useAlert();
  const [isConfirmingDropItem, toggleConfirmDropItem] = useState(false);
  const [confirmedDropItem, setConfirmedDropItem] = useState(false);
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);

  const handleDropItem = async () => {
    if (!isConfirmingDropItem) return false;

    const operation = {
      operation: 'drop_custom_api_endpoint',
      name: item,
    };

    const result = await queryInstance({ operation, auth, url });

    if (result.error) {
      toggleConfirmDropItem(false);
      setConfirmedDropItem(false);
      return alert.error(result.message);
    }

    return buildCustomAPI({ auth, url });
  };

  const selectItemForDrop = () => {
    toggleConfirmDropItem(item);
    toggleDropItem(false);
  };

  const confirmItemForDrop = () => {
    toggleConfirmDropItem(false);
    setConfirmedDropItem(true);
    handleDropItem();
  };

  const cancelConfirmDrop = () => {
    toggleConfirmDropItem(false);
  };

  const handleSetActive = () => (isActive || isDropping || isConfirmingDropItem ? false : history.push(`${baseUrl}/${item}`));

  return (
    <Row key={item} title={`View${isActive ? 'ing' : ''} ${item}`} className={`item-row ${isActive ? 'active' : ''}`} onClick={handleSetActive} tabIndex="0">
      <Col className={`item-label ${isConfirmingDropItem ? 'text-danger text-nowrap' : ''}`}>{isConfirmingDropItem ? `drop ${item}?` : item}</Col>
      <Col className="item-action">
        {confirmedDropItem ? (
          <Button tabIndex="-1" disabled color="purple" className="round">
            <i className="fa fa-spinner fa-spin" />
          </Button>
        ) : isConfirmingDropItem ? (
          <>
            <Button id="confirmDropItem" color="danger" className="round mr-1" title={`confirm drop ${item}`} onClick={confirmItemForDrop}>
              <i className="fa fa-check text-white" />
            </Button>
            <Button id="cancelDropItem" color="black" className="round" title={`Cancel drop ${item}`} onClick={cancelConfirmDrop}>
              <i className="fa fa-times text-white" />
            </Button>
          </>
        ) : isDropping ? (
          <Button id="dropItem" color="danger" className="round" title={`Drop ${item}`} onClick={selectItemForDrop}>
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

export default EntityManagerRow;
