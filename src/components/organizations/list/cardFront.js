import React, { useState } from 'react';
import { Card, CardBody, Col, Row, Button } from 'reactstrap';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../state/appState';

import updateUserOrgs from '../../../api/lms/updateUserOrgs';
import CardFrontStatusRow from '../../shared/cardFrontStatusRow';
import getUser from '../../../api/lms/getUser';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

const CardFront = ({ customer_name, customer_id, total_instance_count, status, setFlipState }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const alert = useAlert();
  const canChooseOrganization = !loading && ['owner', 'accepted'].includes(status);

  const chooseOrganization = async () => canChooseOrganization && history.push(`/o/${customer_id}/instances`);

  const handleUpdateUserOrgs = async (e) => {
    const newStatus = e.currentTarget.getAttribute('data-status');
    setLoading(newStatus);
    const result = await updateUserOrgs({ auth, customer_id, user_id: auth.user_id, status: newStatus });
    if (result.error) {
      alert.error(result.message);
      setLoading(false);
    } else {
      await getUser(auth);
      if (newStatus !== 'declined') setLoading(false);
      alert.success(`Organization ${newStatus} successfully`);
    }
  };

  const handleCardFlipIconClick = (e) => {
    e.stopPropagation();
    const action = e.currentTarget.getAttribute('data-action');
    if (action === 'delete' && total_instance_count) {
      alert.error('You must remove all instances from an Organization before deleting it.');
    } else {
      setFlipState(action);
    }
  };

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id })} FallbackComponent={ErrorFallback}>
      <Card className={`instance ${canChooseOrganization ? 'clickable' : ''}`} onClick={chooseOrganization}>
        <CardBody>
          <Row>
            <Col xs="10" className="org-name">
              {customer_name}
            </Col>
            <Col xs="2" className="status-icons text-right">
              {loading ? (
                <i className="status-icon fa fa-spinner fa-spin text-purple" />
              ) : status === 'accepted' ? (
                <Button data-action="leave" className="status-icon" color="link" title={`Leave ${customer_name} organization`} onClick={handleCardFlipIconClick}>
                  <i className="fa fa-times-circle text-purple" />
                </Button>
              ) : status === 'owner' ? (
                <Button data-action="delete" className="status-icon" color="link" title={`Delete ${customer_name} organization`} onClick={handleCardFlipIconClick}>
                  <i className={`fa fa-trash delete text-purple ${total_instance_count ? 'disabled' : ''}`} />
                </Button>
              ) : null}
            </Col>
          </Row>
          <div className="org-status">Organization {customer_id}</div>
          <CardFrontStatusRow textClass="text-bold" label="ROLE" isReady value={status === 'accepted' ? 'USER' : status.toUpperCase()} bottomDivider />
          <CardFrontStatusRow label="INSTANCES" isReady value={total_instance_count || '...'} />
          <div className="action-buttons">
            {status === 'invited' && (
              <Row noGutters>
                <Col xs="6" className="pr-1">
                  <Button
                    title={`Decline invitation to ${customer_name} organization`}
                    disabled={!!loading}
                    color="danger"
                    block
                    data-status="declined"
                    onClick={handleUpdateUserOrgs}
                  >
                    {loading === 'declined' ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Decline</span>}
                  </Button>
                </Col>
                <Col xs="6" className="pl-1">
                  <Button
                    title={`Accept invitation to ${customer_name} organization`}
                    disabled={!!loading}
                    color="purple"
                    block
                    data-status="accepted"
                    onClick={handleUpdateUserOrgs}
                  >
                    {loading === 'accepted' ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Join</span>}
                  </Button>
                </Col>
              </Row>
            )}
          </div>
        </CardBody>
      </Card>
    </ErrorBoundary>
  );
};
export default CardFront;
