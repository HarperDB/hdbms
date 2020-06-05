import React, { useCallback, useState } from 'react';
import { Card, CardBody, Col, Row, Button } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import appState from '../../../state/appState';
import usePersistedUser from '../../../state/persistedUser';
import getCustomer from '../../../api/lms/getCustomer';
import updateUserOrgs from '../../../api/lms/updateUserOrgs';
import CardFrontStatusRow from '../../shared/cardFrontStatusRow';

const CardFront = ({ customer_name, customer_id, free_cloud_instance_count, total_instance_count, status, fetchUser, setFlipState }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const activeCustomerId = useStoreState(appState, (s) => s.customer?.customer_id);
  const isActiveCustomer = activeCustomerId === customer_id;
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const [customerError, setCustomerError] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const alert = useAlert();

  const chooseOrganization = useCallback(async () => {
    if (isActiveCustomer) {
      history.push(`/${customer_id}/instances`);
    } else {
      setLoading(true);
      const result = await getCustomer({ auth, customer_id });
      if (result.error) {
        setCustomerError(result.message);
        setLoading(false);
      } else {
        setPersistedUser({ ...persistedUser, customer_id });
        appState.update((s) => {
          s.users = false;
          s.instances = false;
          s.hasCard = false;
          s.lastUpdate = false;
        });
        setTimeout(() => history.push(`/${customer_id}/instances`), 0);
      }
    }
  }, []);

  const handleUpdateUserOrgs = useCallback(async (e) => {
    const newStatus = e.currentTarget.getAttribute('data-status');
    setLoading(newStatus);
    const result = await updateUserOrgs({ auth, customer_id, user_id: auth.user_id, status: newStatus });
    if (result.error) {
      alert.error(result.message);
      setLoading(false);
    } else {
      appState.update((s) => {
        s.lastUpdate = Date.now();
      });
      await fetchUser();
      alert.success(`Organization ${newStatus} successfully`);
    }
  }, []);

  const handleCardFlipIconClick = useCallback((e) => {
    e.stopPropagation();
    setFlipState(e.currentTarget.getAttribute('data-action'));
  }, []);

  return (
    <Card className="instance" onClick={() => !loading && chooseOrganization()}>
      <CardBody>
        <Row>
          <Col xs="10" className="org-name">
            {customer_name}
          </Col>
          <Col xs="2" className="status-icon text-right">
            {loading ? (
              <i className="fa fa-spinner fa-spin text-purple" />
            ) : status === 'accepted' ? (
              <i title={`Leave ${customer_name} organization`} className="fa fa-times-circle text-purple" data-action="leave" onClick={handleCardFlipIconClick} />
            ) : status === 'owner' ? (
              <i title={`Delete ${customer_name} organization`} className="fa fa-trash delete text-purple" data-action="delete" onClick={handleCardFlipIconClick} />
            ) : null}
          </Col>
        </Row>
        <div className="org-status">Organization {customer_id}</div>
        <CardFrontStatusRow
          textClass={`text-bold ${customerError ? 'text-danger' : ''}`}
          label="ROLE"
          isReady
          value={customerError ? customerError.toUpperCase() : status === 'accepted' ? 'USER' : status.toUpperCase()}
          bottomDivider
        />
        <CardFrontStatusRow label="INSTANCES" isReady value={total_instance_count || '...'} />
        <div className="action-buttons">
          {customerError ? (
            <Button title={`Remove ${customer_name} Organization`} disabled={!!loading} color="danger" block data-action="delete" onClick={handleCardFlipIconClick}>
              {loading === 'removed' ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Remove This Organization</span>}
            </Button>
          ) : status === 'invited' ? (
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
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
};
export default CardFront;
