import React from 'react';
import { Card, CardBody, Row } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import IntegrationCard from './integrationCard';
import appState from '../../../state/appState';
import getIntegrations from '../../../api/lms/getIntegrations';

let controller;

export default () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const integrations = useStoreState(appState, (s) => s.integrations);

  useAsyncEffect(
    () => {
      controller = new AbortController();
      getIntegrations({ auth, signal: controller.signal });
    },
    () => controller?.abort(),
    []
  );

  return (
    <main id="support">
      <span className="floating-card-header">Marketplace</span>
      <Card className="my-3">
        <CardBody>
          {!integrations ? (
            <div className="py-5 text-center">
              <i className="fa fa-spinner fa-spin text-purple" />
            </div>
          ) : !integrations.length ? (
            <div className="py-5 text-center">We were unable to find any marketplace apps at this time. Please try again later.</div>
          ) : (
            <Row>
              {integrations.map((integration) => (
                <IntegrationCard key={integration.id} {...integration} />
              ))}
            </Row>
          )}
        </CardBody>
      </Card>
    </main>
  );
};
