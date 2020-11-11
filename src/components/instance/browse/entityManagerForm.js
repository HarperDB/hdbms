import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input } from 'reactstrap';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import queryInstance from '../../../functions/api/queryInstance';
import instanceState from '../../../functions/state/instanceState';

import isAlphaNumericUnderscore from '../../../functions/util/isAlphaNumericUnderscore';
import buildInstanceStructure from '../../../functions/instance/buildInstanceStructure';

const EntityManagerForm = ({ items, itemType, activeSchema, toggleDropItem, toggleCreate, baseUrl }) => {
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

    if (entityName && entityName.match(/^[0-9]+$/)) {
      toggleNameError(true);
      error = true;
      alert.error('You may not provide a number as a name.');
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

    await queryInstance(operation, auth, url);

    return buildInstanceStructure({ auth, url });
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
            setEntityName(e.target.value);
          }}
          value={entityName || ''}
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
              setHashAttribute(e.target.value);
            }}
            value={hashAttribute || ''}
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
            <Button id="toggleCreate" color="black" className="round" onClick={() => toggleCreate(false)}>
              <i className="fa fa-times text-white" />
            </Button>
          </>
        )}
      </Col>
    </Row>
  );
};

export default EntityManagerForm;
