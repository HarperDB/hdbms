import React, { useState } from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';

import queryInstance from '../../api/queryInstance';

export default ({ item, itemType, baseUrl, isActive, toggleDropItem, isDropping, activeSchema, auth, refreshInstance }) => {
  const history = useHistory();
  const { schema, table } = useParams();
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

    await queryInstance(operation, auth);
    refreshInstance(Date.now());

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
      <Col className={`text-nowrap text-truncate pt-1 ${isConfirmingDropItem ? 'text-danger text-nowrap' : ''}`}>
        {isConfirmingDropItem ? `drop ${item}?` : item}
      </Col>
      <Col className="item-action text-right">
        { isConfirmingDropItem ? (
          <>
            <Button
              color="danger"
              className="round mr-1"
              title={`confirm drop ${itemType} ${item}`}
              onClick={confirmItemForDrop}
            >
              <i className="fa fa-check text-white" />
            </Button>
            <Button
              color="black"
              className="round"
              title={`Cancel drop ${itemType} ${item}`}
              onClick={cancelConfirmDrop}
            >
              <i className="fa fa-times text-white" />
            </Button>
          </>
        ) : isDropping ? (
          <Button
            color="danger"
            className="round"
            title={`Drop ${itemType} ${item}`}
            onClick={selectItemForDrop}
          >
            <i className="fa fa-minus text-white" />
          </Button>
        ) : isActive ? (
          <Button
            color="purple"
            className="round"
            title={`Viewing ${itemType} ${item}`}
          >
            <i className="fa fa-chevron-right" />
          </Button>
        ) : (
          <Button
            color="link"
            className="round"
            title={`View ${itemType} ${item}`}
          />
        )}
      </Col>
    </Row>
  );
};
