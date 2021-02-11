import React from 'react';
import { Row, Col } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../../functions/state/instanceState';

import EntityManager from './EntityManager';
import CodeEditor from './CodeEditor';
import ErrorFallback from '../../../shared/ErrorFallback';
import addError from '../../../../functions/api/lms/addError';

const ManageIndex = ({ refreshApi, loading }) => {
  const { customer_id, endpoint } = useParams();
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const custom_api = useStoreState(instanceState, (s) => s.custom_api);
  const baseUrl = `/o/${customer_id}/i/${compute_stack_id}/custom-api`;

  return (
    <>
      <Row id="clustering">
        <Col xl="3" lg="4" md="6" xs="12">
          <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
            <EntityManager items={custom_api?.custom_api_endpoints || []} activeItem={endpoint} baseUrl={baseUrl} />
          </ErrorBoundary>
        </Col>
        <Col xl="9" lg="8" md="6" xs="12">
          <CodeEditor refreshApi={refreshApi} loading={loading} />
        </Col>
      </Row>
    </>
  );
};

export default ManageIndex;
