import React, { useCallback, useMemo, useState } from 'react';
import { Card, CardBody, Col, Row, Button } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import appState from '../../../state/appState';
import usePersistedUser from '../../../state/persistedUser';
import getCustomer from '../../../api/lms/getCustomer';
import updateUserOrgs from '../../../api/lms/updateUserOrgs';
import CardFrontStatusRow from '../../shared/cardFrontStatusRow';

const CardFront = ({ customer_name, customer_id, instance_count, status, fetchUser, setFlipState }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const activeCustomerId = useStoreState(appState, (s) => s.customer?.customer_id);
  const isActiveCustomer = activeCustomerId === customer_id;
  const currentOrgUserStatus = useMemo(() => auth?.orgs?.find((o) => o.customer_id === customer_id)?.status, [auth.orgs, activeCustomerId]);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const [customerError, setCustomerError] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const alert = useAlert();

  const chooseOrganization = useCallback(async (e) => {
    const newPage = e.currentTarget.getAttribute('data-page');
    if (isActiveCustomer) {
      history.push(`/${customer_id}/${newPage}`);
    } else {
      setLoading(newPage);
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
        setPersistedUser({ ...persistedUser, customer_id });
        setTimeout(() => history.push(`/${customer_id}/${newPage}`), 0);
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
      await fetchUser();
      setLoading(false);
      alert.success(`Organization ${newStatus} successfully`);
    }
  }, []);

  return (
    <Card className="instance">
      <CardBody>
        <Row>
          <Col xs="10" className="org-name">
            {customer_name}
          </Col>
          <Col xs="2" className="status-icon text-right">
            {status === 'accepted' ? (
              <i title={`Leave ${customer_name} organization`} className="fa fa-times-circle text-purple" onClick={() => setFlipState('leave')} />
            ) : status === 'owner' ? (
              <i title={`Delete ${customer_name} organization`} className="fa fa-trash delete text-purple" onClick={() => setFlipState('delete')} />
            ) : null}
          </Col>
        </Row>
        <div className="org-status">Organization {customer_id}</div>
        <CardFrontStatusRow
          textClass={`text-bold ${customerError ? 'text-danger' : ''}`}
          label="STATUS"
          isReady
          value={customerError ? customerError.toUpperCase() : status.toUpperCase()}
          bottomDivider
        />
        <CardFrontStatusRow label="INSTANCES" isReady value={instance_count || '...'} />
        <div className="action-buttons">
          {customerError ? (
            <Button title={`Remove ${customer_name} Organization`} disabled={!!loading} color="danger" block data-status="removed" onClick={handleUpdateUserOrgs}>
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
          ) : currentOrgUserStatus === 'owner' ? (
            <Row noGutters>
              <Col xs="6" className="pr-1">
                <Button title={`Select ${customer_name} organization`} disabled={!!loading} color="purple" block data-page="instances" onClick={chooseOrganization}>
                  {loading === 'instances' ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Instances</span>}
                </Button>
              </Col>
              <Col xs="6" className="pl-1">
                <Button title={`Manage ${customer_name} organization`} disabled={!!loading} color="purple" block data-page="users" onClick={chooseOrganization}>
                  {loading === 'users' ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Manage</span>}
                </Button>
              </Col>
            </Row>
          ) : (
            <Button title={`Select ${customer_name} organization`} disabled={!!loading} color="purple" block data-page="instances" onClick={chooseOrganization}>
              {loading === 'instances' ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Instances</span>}
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
export default CardFront;
