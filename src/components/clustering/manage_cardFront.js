import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import updateInstanceSubscription from '../../util/updateInstanceSubscription';
import connectToInstance from '../../util/connectToInstance';

export default ({ id, host, port, name, is_ssl, connection, clusterPort, schema, table, instanceAuth, flipCard, refreshInstance, auth }) => {
  const [buttonState, setButtonState] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const subscriptions = schema && table && connection && connection.subscriptions ? connection.subscriptions : [];
  const channel = schema && table && `${schema}:${table}`;
  const channelSubscription = channel && subscriptions.find((s) => s.channel === channel);
  const publish = channelSubscription && channelSubscription.publish;
  const subscribe = channelSubscription && channelSubscription.subscribe;

  useAsyncEffect(async () => {
    if (buttonState) {
      if (buttonState === 'connect') {
        await connectToInstance({ id, host, port, clusterPort, auth });
        setIsConnected(true);
      } else {
        await updateInstanceSubscription({ channel, subscriptions, buttonState, id, host, clusterPort, auth });
      }
      setTimeout(() => refreshInstance(Date.now(), 1000));
      setButtonState(false);
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
            {instanceAuth ? (
              <i className="fa fa-lock text-purple" />
            ) : (
              <i title="Instance Requires Authentication" className="fa fa-unlock-alt text-danger" />
            )}
          </Col>
        </Row>
        <hr className="mt-3 mb-1" />
        <Row className="text-smaller text-nowrap text-darkgrey overflow-hidden mb-3">
          <Col xs="3">URL</Col>
          <Col xs="9">http{is_ssl && 's'}://{host}:{port}</Col>
          <Col xs="12"><hr className="my-1" /></Col>
        </Row>
        {!instanceAuth ? (
          <Row>
            <Col xs="12">
              <Button onClick={flipCard} block color="purple" className="px-2">Authenticate Node</Button>
            </Col>
          </Row>
        ) : !connection && !isConnected ? (
          <Row>
            <Col xs="12">
              <Button onClick={() => setButtonState('connect')} disabled={!!buttonState} block color="purple" className="px-2">Connect to Node</Button>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs="6" className="pr-1">
              <Button onClick={() => setButtonState('togglePublish')} block disabled={!!buttonState} color={publish ? 'success' : 'grey'} className="px-2">Publish</Button>
            </Col>
            <Col xs="6" className="pl-1">
              <Button onClick={() => setButtonState('toggleSubscribe')} block disabled={!!buttonState} color={subscribe ? 'success' : 'grey'} className="px-2">Subscribe</Button>
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  );
};
