import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';

import TutorialManagerRow from './TutorialManagerRow';
import ErrorFallback from '../../shared/ErrorFallback';

import addError from '../../../functions/api/lms/addError';

function TutorialManager({ items, baseUrl, videoId }) {
  return <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
    <div className="entity-manager">
      <div className="floating-card-header">Tutorials</div>
      <Card className="my-3">
        <CardBody>
          {!items.length ? (
            <div className="p-3 text-center">
              <i className="fa-spinner fa fa-spin text-purple" />
            </div>
          ) : (
            items.map((item) => <TutorialManagerRow key={item.id} baseUrl={baseUrl} title={item.snippet.title} videoId={item.id} isActive={videoId === item.id} />)
          )}
        </CardBody>
      </Card>
    </div>
  </ErrorBoundary>
}

export default TutorialManager;
