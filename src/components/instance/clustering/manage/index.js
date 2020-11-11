import React, { useCallback, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import InstanceManager from './entityManager';
import DataTable from './datatable';
import ManageErrorModal from './errorModal';
import ErrorFallback from '../../../shared/errorFallback';
import addError from '../../../../functions/api/lms/addError';
import buildNetwork from '../../../../functions/instance/buildNetwork';
import instanceState from '../../../../functions/state/instanceState';
import appState from '../../../../functions/state/appState';

const ManageIndex = () => {
  const { compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const instances = useStoreState(appState, (s) => s.instances);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshNetwork = useCallback(async () => {
    setLoading(true);
    await buildNetwork({ auth, url, instances, compute_stack_id });
    setLoading(false);
  }, [compute_stack_id, instances, auth, url]);

  return (
    <>
      <Row id="clustering">
        <Col xl="3" lg="4" md="6" xs="12">
          <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
            <InstanceManager setShowModal={setShowModal} itemType="connected" refreshNetwork={refreshNetwork} loading={loading} />
            <InstanceManager itemType="unconnected" refreshNetwork={refreshNetwork} loading={loading} />
            <InstanceManager itemType="unregistered" refreshNetwork={refreshNetwork} loading={loading} />
          </ErrorBoundary>
        </Col>
        <Col xl="9" lg="8" md="6" xs="12">
          <DataTable refreshNetwork={refreshNetwork} loading={loading} />
        </Col>
      </Row>
      <ManageErrorModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default ManageIndex;
