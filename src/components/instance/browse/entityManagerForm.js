import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input } from 'reactstrap';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';

import queryInstance from '../../../functions/api/queryInstance';
import instanceState from '../../../functions/state/instanceState';

import isAlphaNumericUnderscore from '../../../functions/util/isAlphaNumericUnderscore';

export default ({ items, itemType, activeSchema, toggleDropItem, toggleCreate, baseUrl }) => {
  const { compute_stack_id, customer_id } = useParams();
  const history = useHistory();
  const alert = useAlert();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);

  const [entityName, setEntityName] = useState(false);
  const [nameError, toggleNameError] = useState(false);
  const [hashAttribute, setHashAttribute] = useState(false);
  const [hashError, toggleHashError] = useState(false);
  const [addingItem, setAddingItem] = useState(false);

  const createItem = async (e) => {
    e.preventDefault();
    let error = false;

    if (!entityName || items.includes(entityName)) {
      toggleNameError(true);
      error = true;
    }

    if (entityName && !isAlphaNumericUnderscore(entityName)) {
      toggleNameError(true);
      error = true;
      alert.error('You may only use alphanumeric characters or underscores.');
    }

    if (itemType === 'table' && !hashAttribute) {
      error = true;
      toggleHashError(true);
    }

    if (error) return false;

    setAddingItem(true);

    const operation = {
      operation: `create_${itemType}`,
    };

    if (itemType === 'table') {
      operation.schema = activeSchema;
      operation.table = entityName;
      operation.hash_attribute = hashAttribute;
    } else {
      operation.schema = entityName;
    }

    await queryInstance(operation, auth, url, compute_stack_id, customer_id);

    return instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
  };

  useEffect(() => toggleDropItem(), [toggleDropItem]);

  useEffect(() => {
    if (entityName && items.find((i) => i === entityName)) {
      history.push(`${baseUrl}/${entityName}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <Row className="item-row form">
      <Col className="input-holder">
        <Input
          id="name"
          invalid={nameError}
          onChange={(e) => {
            toggleNameError(false);
            setEntityName(e.target.value.toString());
          }}
          disabled={addingItem}
          type="text"
          name="name"
          placeholder="name"
        />
      </Col>
      {itemType === 'table' && (
        <Col className="input-holder">
          <Input
            id="hash_attribute"
            invalid={hashError}
            disabled={addingItem}
            onChange={(e) => {
              toggleHashError(false);
              setHashAttribute(e.target.value.toString());
            }}
            type="test"
            name="hash_attribute"
            placeholder="hash attr."
          />
        </Col>
      )}
      <Col className="item-action">
        {addingItem ? (
          <Button color="success" className="round mr-1">
            <i className="fa fa-spinner fa-spin text-white" />
          </Button>
        ) : (
          <>
            <Button id="createItem" color="success" className="round mr-1" onClick={createItem} onKeyDown={(e) => e.keyCode !== 13 || createItem(e)}>
              <i className="fa fa-check text-white" />
            </Button>
            <Button color="black" className="round" onClick={() => toggleCreate(false)}>
              <i className="fa fa-times text-white" />
            </Button>
          </>
        )}
      </Col>
    </Row>
  );
};
