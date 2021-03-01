import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';

import instanceState from '../../../../functions/state/instanceState';

import EntityManager from './EntityManager';
import CodeEditor from './CodeEditor';
import EmptyPrompt from './EmptyPrompt';
import ErrorFallback from '../../../shared/ErrorFallback';
import addError from '../../../../functions/api/lms/addError';

const ManageIndex = ({ refreshApi, loading }) => {
  const { customer_id, endpoint } = useParams();
  const history = useHistory();
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const custom_functions = useStoreState(instanceState, (s) => s.custom_functions);
  const baseUrl = `/o/${customer_id}/i/${compute_stack_id}/functions`;

  useEffect(() => {
    if (!endpoint && custom_functions?.endpoints?.length) {
      history.push(`/o/${customer_id}/i/${compute_stack_id}/functions/${custom_functions?.endpoints[0]}`);
    }
  }, [endpoint, custom_functions?.endpoints, customer_id, compute_stack_id, history]);

  return (
    <>
      <Row id="clustering">
        <Col xl="3" lg="4" md="6" xs="12">
          <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
            <EntityManager items={custom_functions?.endpoints || []} activeItem={endpoint} baseUrl={baseUrl} />
          </ErrorBoundary>
        </Col>
        <Col xl="9" lg="8" md="6" xs="12">
          {endpoint ? (
            <CodeEditor refreshApi={refreshApi} loading={loading} />
          ) : (
            <EmptyPrompt refreshApi={refreshApi} headline={`Please ${custom_functions.endpoints.length ? 'choose' : 'create'} an endpoint at left`} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default ManageIndex;
