import React, { useState, useCallback } from 'react';
import { Card, CardBody, Row } from '@nio/ui-kit';
import useInterval from 'use-interval';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import { useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { useHistory } from 'react-router';

import config from '../../../config';
import appState from '../../state/appState';
import usePersistedUser from '../../state/persistedUser';

import SubNav from './subnav';
import OrgCard from './list/orgCard';
import NewOrgCard from './list/newOrgCard';
import getUser from '../../api/lms/getUser';
import filterOrgs from '../../methods/organizations/filterOrgs';
import getCustomer from '../../api/lms/getCustomer';
import NewOrgModal from './new';

const OrganizationsIndex = () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const orgSearch = useStoreState(appState, (s) => s.orgSearch);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const { action } = useParams();
  const [fetchingCustomer, setFetchingCustomer] = useState(true);
  const history = useHistory();
  const { search } = useLocation();
  const { returnURL } = queryString.parse(search);

  useAsyncEffect(async () => {
    if (action === 'load') {
      let customer_id = false;
      switch (true) {
        case !!persistedUser.customer_id:
          customer_id = persistedUser.customer_id;
          break;
        case auth.orgs.length === 1 && ['accepted', 'owner', 'admin'].includes(auth.orgs[0].status):
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
          setPersistedUser({ ...persistedUser, customer_id });
          setTimeout(() => history.push(returnURL || `/${customer_id}/instances`), 200);
        }
      } else {
        setFetchingCustomer(false);
      }
    }
  }, [auth?.orgs]);

  const fetchUser = useCallback(async () => {
    if (!action) {
      const response = await getUser(auth);
      setPersistedUser({ ...persistedUser, ...response });
      appState.update((s) => {
        s.auth = { ...auth, ...response };
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
        {auth?.orgs && filterOrgs({ orgSearch, orgs: auth.orgs }).map((org) => <OrgCard key={org.customer_id} fetchUser={fetchUser} {...org} />)}
      </Row>
      {action === 'new' && <NewOrgModal />}
    </div>
  );
};

export default OrganizationsIndex;
