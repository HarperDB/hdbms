import React, { useState } from 'react';
import { Card, CardBody, Row, Col, Button, Input, Form } from '@nio/ui-kit';
import { withRouter } from 'react-router-dom';

import ConfirmDrop from './confirmdrop';
import queryHarperDB from '../../util/queryHarperDB';
import executeFunctions from '../../util/executeFunctions';

export default withRouter(({ history, activeItem, items, itemType, activeSchema, connection, refreshDB, toggleFilter }) => {
  const [entityName, setEntityName] = useState(false);
  const [nameError, toggleNameError] = useState(false);
  const [hashAttribute, setHashAttribute] = useState(false);
  const [hashError, toggleHashError] = useState(false);
  const [drop, toggleDrop] = useState(false);
  const [confirmDrop, toggleConfirmDrop] = useState(false);
  const [create, toggleCreate] = useState(false);

  const setActiveItem = (destination = false) => {
    toggleFilter();
    if (itemType === 'table') {
      history.push(`/browse/${activeSchema}/${destination || ''}`);
    } else {
      history.push(`/browse/${destination || ''}`);
    }
  };

  const createItem = async (e) => {
    e.preventDefault();
    toggleDrop(false);
    let error = false;

    if (!entityName || items.includes(entityName)) {
      toggleNameError(true);
      error = true;
    }

    if (itemType === 'table' && !hashAttribute) {
      error = true;
      toggleHashError(true);
    }

    if (error) {
      return false;
    }

    const operation = { operation: `create_${itemType}` };

    if (itemType === 'table') {
      operation.schema = activeSchema;
      operation.table = entityName;
      operation.hash_attribute = hashAttribute;
    } else {
      operation.schema = entityName;
    }

    await queryHarperDB(connection, operation, refreshDB);
    executeFunctions([
      setActiveItem(entityName),
      setEntityName(),
      setHashAttribute(),
      toggleNameError(),
      toggleHashError(),
      toggleCreate(),
    ]);
  };

  const dropItem = async (item) => {
    toggleDrop(false);

    const operation = { operation: `drop_${itemType}` };

    if (itemType === 'table') {
      operation.schema = activeSchema;
      operation.table = item;
    } else {
      operation.schema = item;
    }

    if (item === activeItem) {
      setActiveItem();
    }

    queryHarperDB(connection, operation, refreshDB);
  };

  return (
    <div className="db-browser">
      <Row>
        <Col className="text-white">
          {itemType}s
        </Col>
        { items && items.length ? (
          <Col className="text-right">
            <a className="fa-stack fa-sm" onClick={() => executeFunctions([toggleDrop(!drop), toggleCreate(false)])}>
              <i className={`fa fa-circle fa-stack-2x text-white-overlay`} />
              <i className={`fa fa-minus fa-stack-1x text-${drop ? 'danger' : 'purple'}`} />
            </a>
            <a className="fa-stack fa-sm" onClick={() => executeFunctions([toggleCreate(!create), toggleDrop(false)])}>
              <i className={`fa fa-circle fa-stack-2x text-white-overlay`} />
              <i className={`fa fa-plus fa-stack-1x text-${create ? 'success' : 'purple'}`} />
            </a>
          </Col>
        ) :null}
      </Row>
      <Card className="mb-3 mt-2">
        <CardBody>
          <Form onSubmit={createItem}>
            {items && items.length ? items.sort().map((item) => (
              <Row
                key={item}
                className="item-row"
                onClick={() => (drop ? toggleConfirmDrop(item) : setActiveItem(item))}
              >
                <Col>
                  {item}
                </Col>
                <Col className="text-right">
                  { drop ? (
                    <span className="fa-stack fa-sm">
                      <i className="fa fa-circle fa-stack-2x text-danger" />
                      <i className="fa fa-minus fa-stack-1x text-white" />
                    </span>
                  ) : item === activeItem ? (
                    <span className="fa-stack fa-sm">
                      <i className="fa fa-circle fa-stack-2x text-purple" />
                      <i className="fa fa-chevron-right fa-stack-1x text-white" />
                    </span>
                  ) : (
                    null
                  )}
                </Col>
              </Row>
            )) : null}
            {(!items || !items.length || create) && (
              <Row className="item-row form">
                <Col className={`input-holder ${itemType}`}>
                  <Input
                    invalid={nameError}
                    onChange={(e) => executeFunctions([toggleNameError(false), setEntityName(e.target.value)])}
                    type="text"
                    name="name"
                    placeholder="name"
                  />
                </Col>
                  { itemType === 'table' && (
                    <Col className={`input-holder ${itemType}`}>
                      <Input
                        invalid={hashError}
                        onChange={(e) => executeFunctions([toggleHashError(false), setHashAttribute(e.target.value)])}
                        type="test"
                        name="hash_attribute"
                        placeholder="hash attr."
                      />
                    </Col>
                  )}
                <Col xs="2" className="add-item text-right">
                  <Button
                    color="link"
                    className="p-0"
                  >
                    <span className="fa-stack fa-sm">
                      <i className="fa fa-circle fa-stack-2x text-success" />
                      <i className="fa fa-check fa-stack-1x text-white" />
                    </span>
                  </Button>
                </Col>
              </Row>
            )}
          </Form>
        </CardBody>
      </Card>
      <ConfirmDrop
        itemName={confirmDrop}
        itemType={itemType}
        affirmativeMethod={dropItem}
        cancelMethod={() => toggleConfirmDrop(false)}
      />
    </div>
  );
});
