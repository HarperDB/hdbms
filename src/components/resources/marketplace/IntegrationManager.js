import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../functions/state/appState';

import IntegrationManagerRow from './IntegrationManagerRow';
import ErrorFallback from '../../shared/ErrorFallback';

import addError from '../../../functions/api/lms/addError';

const IntegrationManager = () => {
  const { type } = useParams();
  const types = useStoreState(appState, (s) => (s.integrations ? Object.keys(s.integrations).filter((k) => s.integrations[k].length) : ['active']));
  const baseUrl = '/resources/marketplace';

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <div className="entity-manager">
        <div className="floating-card-header">Status</div>
        <Card className="my-3">
          <CardBody>{types && types.length ? types.map((item) => <IntegrationManagerRow key={item} item={item} baseUrl={baseUrl} isActive={type === item} />) : null}</CardBody>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default IntegrationManager;
