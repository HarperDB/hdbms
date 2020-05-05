import React, { useCallback, useState } from 'react';
import { Card, CardBody, Col, Row, Button } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import appState from '../../state/appState';
import usePersistedLMSAuth from '../../state/persistedLMSAuth';

import getCustomer from '../../api/lms/getCustomer';
import updateUserOrgs from '../../api/lms/updateUserOrgs';

import CardFrontStatusRow from '../instances/list/cardFrontStatusRow';
import getUser from '../../api/lms/getUser';

const CardFront = ({ customer_name, customer_id, instance_count, status }) => {
  const [persistedLMSAuth, setPersistedLMSAuth] = usePersistedLMSAuth({});
  const [customerError, setCustomerError] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useStoreState(appState, (s) => s.auth);
  const activeCustomerId = useStoreState(appState, (s) => s.customer?.customer_id);
  const history = useHistory();
  const alert = useAlert();

  const chooseOrganization = useCallback(async () => {
    setLoading(true);
    const result = await getCustomer({ auth, customer_id });
    if (result.error) {
      setCustomerError(result.message);
      setLoading(false);
    } else {
      appState.update((s) => {
        s.users = false;
        s.instances = false;
        s.hasCard = false;
        s.lastUpdate = false;
      });
      setPersistedLMSAuth({ ...persistedLMSAuth, customer_id });
      setTimeout(() => history.push('/instances'), 0);
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
      await getUser({ auth });
      setLoading(false);
      alert.success(`Invitation ${newStatus} successfully`);
    }
  }, []);

  return (
    <Col xs="12" md="6" lg="4" xl="3" className="mb-4">
      <Card title="Switch to This Org" className="instance">
        <CardBody>
          <Row>
            <Col xs="10" className="org-name">
              {customer_name}
            </Col>
            <Col xs="2" className="status-icon text-right">
              {activeCustomerId === customer_id ? (
                <i className="fa fa-check-circle text-purple" />
              ) : customerError ? (
                <i className="fa fa-exclamation-circle text-danger" />
              ) : status === 'accepted' ? (
                <i className="fa fa-check-circle text-purple" />
              ) : status === 'invited' ? (
                <i className="fa fa-question-circle text-purple" />
              ) : null}
            </Col>
          </Row>
          <div className="org-status">Organization</div>
          <CardFrontStatusRow
            textClass={`text-bold ${customerError ? 'text-danger' : ''}`}
            label="STATUS"
            isReady
            value={activeCustomerId === customer_id ? 'ACTIVE' : customerError ? customerError.toUpperCase() : status.toUpperCase()}
            bottomDivider
          />
          <CardFrontStatusRow label="INSTANCE COUNT" isReady value={instance_count || '...'} />
          <div className="action-buttons">
            {customerError ? (
              <Button disabled={!!loading} color="danger" block data-status="removed" onClick={handleUpdateUserOrgs}>
                {loading ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Remove This Organization</span>}
              </Button>
            ) : status === 'invited' ? (
              <Row noGutters>
                <Col xs="6" className="pr-1">
                  <Button disabled={!!loading} color="danger" block data-status="declined" onClick={handleUpdateUserOrgs}>
                    {loading === 'declined' ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Decline</span>}
                  </Button>
                </Col>
                <Col xs="6" className="pl-1">
                  <Button disabled={!!loading} color="purple" block data-status="accepted" onClick={handleUpdateUserOrgs}>
                    {loading === 'accepted' ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Accept</span>}
                  </Button>
                </Col>
              </Row>
            ) : activeCustomerId === customer_id ? (
              <Button color="purple" block onClick={() => history.push('/instances')}>
                Return To This Organization
              </Button>
            ) : (
              <Button disabled={loading} color="purple" block onClick={chooseOrganization}>
                {loading ? <i className="fa fa-spinner fa-spin text-white" /> : <span>{activeCustomerId ? 'Switch To' : 'Select'} This Organization</span>}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CardFront;