import React, { useState } from 'react';
import { Card, CardBody, Col, Row, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';
import appState from '../../../functions/state/appState';
import updateUserOrgs from '../../../functions/api/lms/updateUserOrgs';
import CardFrontStatusRow from '../../shared/CardFrontStatusRow';
import getUser from '../../../functions/api/lms/getUser';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
import CardFrontIcons from './CardFrontIcons';
function CardFront({
  customerName,
  customerId,
  totalInstanceCount,
  status,
  setFlipState
}) {
  const auth = useStoreState(appState, s => s.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const alert = useAlert();
  const canChooseOrganization = !loading && ['owner', 'accepted'].includes(status);
  const chooseOrganization = async () => canChooseOrganization && navigate(`/o/${customerId}/instances`);
  const handleUpdateUserOrgs = async e => {
    const newStatus = e.currentTarget.getAttribute('data-status');
    setLoading(newStatus);
    const result = await updateUserOrgs({
      auth,
      customerId,
      userId: auth.userId,
      status: newStatus
    });
    if (result.error) {
      alert.error(result.message);
      setLoading(false);
    } else {
      await getUser(auth);
      if (newStatus !== 'declined') setLoading(false);
      alert.success(`Organization ${newStatus} successfully`);
    }
  };
  return <ErrorBoundary onError={(error, componentStack) => addError({
    error: {
      message: error.message,
      componentStack
    },
    customerId
  })} FallbackComponent={ErrorFallback}>
      <Card className={`instance ${canChooseOrganization ? 'clickable' : ''}`} onClick={chooseOrganization}>
        <CardBody>
          <Row className="g-0">
            <Col xs="10" className="org-name">
              {customerName}
            </Col>
            <Col xs="2" className="status-icons text-end">
              <CardFrontIcons status={status} loading={loading} customer_name={customerName} setFlipState={setFlipState} total_instance_count={totalInstanceCount} />
            </Col>
          </Row>
          <div className="org-status">ORG ID: {customerId}</div>
          <CardFrontStatusRow textClass="text-bold" label="ROLE" isReady value={status === 'accepted' ? 'USER' : status.toUpperCase()} bottomDivider />
          <CardFrontStatusRow label="INSTANCES" isReady value={totalInstanceCount || '...'} />
          <div className="action-buttons">
            {status === 'invited' && <Row className="g-0">
                <Col xs="6" className="pe-1">
                  <Button title={`Decline invitation to ${customerName} organization`} disabled={!!loading} color="danger" block data-status="declined" onClick={handleUpdateUserOrgs}>
                    {loading === 'declined' ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Decline</span>}
                  </Button>
                </Col>
                <Col xs="6" className="ps-1">
                  <Button title={`Accept invitation to ${customerName} organization`} disabled={!!loading} color="success" block data-status="accepted" onClick={handleUpdateUserOrgs}>
                    {loading === 'accepted' ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Join</span>}
                  </Button>
                </Col>
              </Row>}
          </div>
        </CardBody>
      </Card>
    </ErrorBoundary>;
}
export default CardFront;