import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';
import { useStoreState } from 'pullstate';

import instanceState from '../../../../functions/state/instanceState';

import EntityManager from './entityManager';
import DataTableContainer from './datatableContainer';
import ManageErrorModal from './errorModal';
import ErrorFallback from '../../../shared/errorFallback';
import addError from '../../../../functions/api/lms/addError';

const ManageIndex = ({ refreshNetwork, loading, setLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const clustering = useStoreState(instanceState, (s) => s.clustering);

  return (
    <>
      <Row id="clustering">
        <Col xl="3" lg="4" md="6" xs="12">
          <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
            <EntityManager
              items={clustering?.connected || []}
              itemType="connected"
              loading={loading}
              refreshNetwork={refreshNetwork}
              setLoading={setLoading}
              setShowModal={setShowModal}
            />
            <EntityManager items={clustering?.unconnected || []} itemType="unconnected" loading={loading} refreshNetwork={refreshNetwork} setLoading={setLoading} />
            <EntityManager items={clustering?.unregistered || []} itemType="unregistered" loading={loading} refreshNetwork={refreshNetwork} setLoading={setLoading} />
          </ErrorBoundary>
        </Col>
        <Col xl="9" lg="8" md="6" xs="12">
          <DataTableContainer refreshNetwork={refreshNetwork} loading={loading} />
        </Col>
      </Row>
      <ManageErrorModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default ManageIndex;
