import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';

import EntityManagerRow from './entityManagerRow';
import ErrorFallback from '../../shared/errorFallback';

import addError from '../../../api/lms/addError';

export default ({ items, baseUrl, videoId }) => (
  <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
    <div className="entity-manager">
      <div className="floating-card-header">Tutorials</div>
      <Card className="my-3">
        <CardBody>
          {!items.length ? (
            <div className="p-3 text-center">
              <i className="fa-spinner fa fa-spin text-purple" />
            </div>
          ) : (
            items.map((item) => <EntityManagerRow key={item.id} baseUrl={baseUrl} title={item.snippet.title} videoId={item.id} isActive={videoId === item.id} />)
          )}
        </CardBody>
      </Card>
    </div>
  </ErrorBoundary>
);
