import React, { useState, useContext } from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import useReactRouter from 'use-react-router';
import { HarperDBContext } from '../../providers/harperdb';

export default ({ item, itemType, baseUrl, isActive, toggleDropItem, isDropping, activeSchema, update }) => {
  const { history, match: { params: { schema, table } } } = useReactRouter();
  const { queryHarperDB } = useContext(HarperDBContext);

  const [isConfirmingDropItem, toggleConfirmDropItem] = useState(false);

  const handleDropItem = async () => {
    if (!itemType || !isConfirmingDropItem) return false;

    const operation = { operation: `drop_${itemType}` };

    if (itemType === 'table') {
      operation.schema = activeSchema;
      operation.table = item;
    } else {
      operation.schema = item;
    }

    await queryHarperDB(operation);
    update(Date.now());

    return ((itemType === 'schema' && item === schema) || (itemType === 'table' && item === table)) ? setTimeout(() => history.push(baseUrl), 100) : false;
  };

  const selectItemForDrop = () => { toggleConfirmDropItem(item); toggleDropItem(false); };

  const confirmItemForDrop = () => { toggleConfirmDropItem(false); handleDropItem(item); };

  const cancelConfirmDrop = () => { toggleConfirmDropItem(false); };

  const handleSetActive = () => (isActive || isDropping || isConfirmingDropItem ? false : history.push(`${baseUrl}/${item}`));

  return (
    <Row
      key={item}
      className="item-row"
      onClick={handleSetActive}
    >
      <Col className={isConfirmingDropItem ? 'text-danger' : ''}>
        {isConfirmingDropItem ? `confirm drop ${item}?` : item}
      </Col>
      <Col className="item-action text-right">
        { isConfirmingDropItem ? (
          <>
            <Button
              color="danger"
              className="round mr-1"
              onClick={confirmItemForDrop}
            >
              <i className="fa fa-check text-white" />
            </Button>
            <Button
              color="grey"
              className="round"
              onClick={cancelConfirmDrop}
            >
              <i className="fa fa-times text-white" />
            </Button>
          </>
        ) : isDropping ? (
          <Button
            color="danger"
            className="round"
            onClick={selectItemForDrop}
          >
            <i className="fa fa-minus text-white" />
          </Button>
        ) : isActive ? (
          <Button
            color="grey"
            className="round"
          >
            <i className="fa fa-chevron-right" />
          </Button>
        ) : (
          <Button
            color="link"
            className="round"
          />
        )}
      </Col>
    </Row>
  );
};
