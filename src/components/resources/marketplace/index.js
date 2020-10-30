import React, { lazy } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';

import IntegrationCard from './integrationCard';
import appState from '../../../functions/state/appState';
import getIntegrations from '../../../functions/api/lms/getIntegrations';
import EntityManager from './entityManager';
import AddIntegration from './add';

let controller;

const logoMapper = {
  cplusplus: lazy(() => import('../../../assets/images/svg/c++.svg')),
  c: lazy(() => import('../../../assets/images/svg/c.svg')),
  csharp: lazy(() => import('../../../assets/images/svg/csharp.svg')),
  golang: lazy(() => import('../../../assets/images/svg/golang.svg')),
  kotlin: lazy(() => import('../../../assets/images/svg/kotlin.svg')),
  ruby: lazy(() => import('../../../assets/images/svg/ruby.svg')),
};

export default () => {
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);
  const integrations = useStoreState(appState, (s) => s.integrations);
  const { type } = useParams();

  useAsyncEffect(
    () => {
      if (!type) {
        history.push('/resources/marketplace/active');
      }
      controller = new AbortController();
      getIntegrations({ auth, signal: controller.signal });
    },
    () => controller?.abort(),
    []
  );

  useAsyncEffect(() => {
    if (integrations && (!integrations[type] || !integrations[type].length)) {
      history.push('/resources/marketplace/active');
    }
  }, [integrations, type]);

  return (
    <Row id="support">
      <Col xl="3" lg="4" md="5" xs="12">
        <EntityManager />
        {auth?.email && <AddIntegration />}
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        <span className="floating-card-header">Marketplace</span>
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
      </Col>
    </Row>
  );
};
