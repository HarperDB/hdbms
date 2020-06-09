import React, { useState, useCallback } from 'react';
import { Card, CardBody, Row } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import { useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { useHistory } from 'react-router';

import appState from '../../state/appState';

import SubNav from './subnav';
import OrgList from './list/orgList';
import NewOrgCard from './list/newOrgCard';
import getUser from '../../api/lms/getUser';
import getCustomer from '../../api/lms/getCustomer';
import NewOrgModal from './new';

const OrganizationsIndex = () => {
  const { action } = useParams();
  const history = useHistory();
  const { search } = useLocation();
  const { returnURL } = queryString.parse(search);
  const auth = useStoreState(appState, (s) => s.auth);
  const [fetchingCustomer, setFetchingCustomer] = useState(true);

  useAsyncEffect(async () => {
    if (action === 'load') {
      let customer_id = false;
      switch (true) {
        case returnURL && returnURL.indexOf('/profile') === -1 && returnURL.indexOf('/support') === -1 && returnURL.indexOf('/organizations') === -1:
          [, customer_id] = returnURL.split('/');
          break;
        case auth?.orgs?.length === 1 && ['accepted', 'owner', 'admin'].includes(auth.orgs[0].status):
          customer_id = auth.orgs[0].customer_id;
          break;
        default:
          break;
      }

      if (customer_id) {
        const result = await getCustomer({ auth, customer_id });

        if (result.error) {
          setFetchingCustomer(false);
        } else {
          history.push(returnURL || `/${customer_id}/instances`);
        }
      } else {
        setFetchingCustomer(false);
      }
    }
  }, [auth?.orgs]);

  const fetchUser = useCallback(async () => {
    if (!action) {
      const response = await getUser(auth);
      appState.update((s) => {
        s.auth = { ...auth, ...response };
        s.lastUpdate = Date.now();
      });
    }
  }, [action]);

  return action === 'load' && fetchingCustomer ? (
    <div id="login-form">
      <Card className="mb-3">
        <CardBody className="text-white text-center">
          <div className="mb-3">loading instances</div>
          <i className="fa fa-spinner fa-spin text-white" />
        </CardBody>
      </Card>
      <div className="login-nav-link">&nbsp;</div>
    </div>
  ) : (
    <div id="organizations">
      <SubNav />
      <Row>
        <NewOrgCard />
        <OrgList fetchUser={fetchUser} />
      </Row>
      {action === 'new' && <NewOrgModal />}
    </div>
  );
};

export default OrganizationsIndex;
