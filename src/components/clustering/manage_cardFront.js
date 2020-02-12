import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import queryInstance from '../../util/queryInstance';

export default ({ id, host, port, name, node_name, is_ssl, connection, pub, sub, hasAuth, flipCard, refreshInstance, auth }) => {
  const [buttonState, setButtonState] = useState(false);

  useAsyncEffect(async () => {
    if (buttonState) {
      if (buttonState === 'connect') {
        const response = await queryInstance({ operation: 'add_node', name: id, host, port }, auth);
        console.log(response);
        refreshInstance(Date.now());
        setButtonState(false);
      }
      if (buttonState === 'pub') {
        const response = await queryInstance({ operation: 'update_node', name: id, host, port }, auth);
        console.log(response);
        refreshInstance(Date.now());
        setButtonState(false);
      }
      if (buttonState === 'sub') {
        const response = await queryInstance({ operation: 'update_node', name: id, host, port }, auth);
        console.log(response);
        refreshInstance(Date.now());
        setButtonState(false);
      }
    }
  }, [buttonState]);

  return (
    <Card className="instance">
      <CardBody>
        <Row>
          <Col xs="10">
            {name}
          </Col>
          <Col xs="2" className="text-right">
            {hasAuth ? (
              <i className="fa fa-lock text-purple" />
            ) : (
              <i title="Instance Requires Authentication" className="fa fa-unlock-alt text-danger" />
            )}
          </Col>
        </Row>
        <hr className="mt-3 mb-1" />
        <Row className="text-smaller text-nowrap text-darkgrey overflow-hidden">
          <Col xs="3">URL</Col>
          <Col xs="9">http{is_ssl && 's'}://{host}:{port}</Col>
          <Col xs="12"><hr className="my-1" /></Col>
          <Col xs="3">Node Name</Col>
          <Col xs="9">{node_name}</Col>
          <Col xs="12"><hr className="mt-1 mb-2" /></Col>
        </Row>
        {!hasAuth ? (
          <Row>
            <Col xs="12">
              <Button onClick={flipCard} block color="purple" className="px-2">Authenticate Node</Button>
            </Col>
          </Row>
        ) : !connection ? (
          <Row>
            <Col xs="12">
              <Button onClick={() => setButtonState('connect')} block color="purple" className="px-2">Connect to Node</Button>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs="6" className="pr-1">
              <Button onClick={() => setButtonState('pub')} block outline={!pub} color="purple" className="px-2">Pub</Button>
            </Col>
            <Col xs="6" className="pl-1">
              <Button onClick={() => setButtonState('sub')} block outline={!sub} color="purple" className="px-2">Sub</Button>
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  );
};
