import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import connectToInstance from '../../util/connectToInstance';
import updateInstanceSubscription from '../../util/updateInstanceSubscription';

export default ({ id, host, port, name, is_ssl, connection, clusterPort, schema, table, instanceAuth, refreshInstance, auth, setAuth }) => {
  const [buttonState, setButtonState] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subscriptions = schema && table && connection && connection.subscriptions ? connection.subscriptions : [];
  const channel = schema && table && `${schema}:${table}`;
  const channelSubscription = channel && subscriptions.find((s) => s.channel === channel);
  const publish = channelSubscription && channelSubscription.publish;
  const subscribe = channelSubscription && channelSubscription.subscribe;

  useAsyncEffect(async () => {
    if (buttonState && !isLoading) {
      setIsLoading(true);
      if (buttonState === 'connect') {
        await connectToInstance({ id, host, port, clusterPort, auth });
        setIsConnected(true);
      } else {
        await updateInstanceSubscription({ channel, subscriptions, buttonState, id, host, clusterPort, auth });
      }
      setTimeout(() => {
        refreshInstance(Date.now());
        setButtonState(false);
        setIsLoading(false);
      }, 1000);
    }
  }, [buttonState]);

  return (
    <Col xs="12">
      <Card className="manage">
        <CardBody>
          <Row>
            <Col xs={!instanceAuth ? 3 : 6} className="instance-name">
              {name}<br />
              <span className="text-smaller">http{is_ssl && 's'}://{host}:{port}</span>
            </Col>
            {!connection && !isConnected ? (
              <Col xs="6">
                <Button onClick={() => setButtonState('connect')} block color="purple" className="px-2">
                  {buttonState === 'connect' ? <i className="fa fa-spinner fa-spin" /> : <span>Connect to Node</span>}
                </Button>
              </Col>
            ) : (
              <Col xs="6">
                <Row>
                  <Col xs="6">
                    <Button onClick={() => setButtonState('togglePublish')} block color={publish ? 'success' : 'grey'} className="px-2">
                      {buttonState === 'togglePublish' ? <i className="fa fa-spinner fa-spin" /> : <span>Publish</span>}
                    </Button>
                  </Col>
                  <Col xs="6">
                    <Button onClick={() => setButtonState('toggleSubscribe')} block color={subscribe ? 'success' : 'grey'} className="px-2">
                      {buttonState === 'toggleSubscribe' ? <i className="fa fa-spinner fa-spin" /> : <span>Subscribe</span>}
                    </Button>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};
