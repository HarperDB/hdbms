import React, { lazy } from 'react';
import { Card, CardBody, Row } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useParams, useNavigate } from 'react-router-dom';

import IntegrationCard from './IntegrationCard';
import appState from '../../../functions/state/appState';
import getIntegrations from '../../../functions/api/lms/getIntegrations';

let controller;

const logoMapper = {
  cplusplus: lazy(() => import('../../../assets/images/svg/c++.svg')),
  c: lazy(() => import('../../../assets/images/svg/c.svg')),
  csharp: lazy(() => import('../../../assets/images/svg/csharp.svg')),
  golang: lazy(() => import('../../../assets/images/svg/golang.svg')),
  kotlin: lazy(() => import('../../../assets/images/svg/kotlin.svg')),
  ruby: lazy(() => import('../../../assets/images/svg/ruby.svg')),
};

function MarketplaceIndex() {
  const navigate = useNavigate();
  const auth = useStoreState(appState, (s) => s.auth);
  const integrations = useStoreState(appState, (s) => s.integrations);
  const { type } = useParams();

  useAsyncEffect(
    () => {
      if (!type) {
        navigate('/resources/marketplace/active');
      }
      controller = new AbortController();
      getIntegrations({ auth, signal: controller.signal });
    },
    () => controller?.abort(),
    []
  );

  useAsyncEffect(() => {
    if (integrations && (!integrations[type] || !integrations[type].length)) {
      navigate('/resources/marketplace/active');
    }
  }, [integrations, type]);

  return (
    <div id="support">
      <span className="floating-card-header">SDKs</span>
      <Card className="my-3">
        <CardBody>
          {!integrations ? (
            <div className="py-5 text-center">
              <i className="fa fa-spinner fa-spin text-purple" />
            </div>
          ) : integrations[type] && !integrations[type].length ? (
            <div className="py-5 text-center">We were unable to find any marketplace apps at this time. Please try again later.</div>
          ) : integrations[type] ? (
            <Row>
              {integrations[type].map((integration) => (
                <IntegrationCard key={integration.id} {...integration} icon={logoMapper[integration.meta.language]} />
              ))}
            </Row>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}

export default MarketplaceIndex;
