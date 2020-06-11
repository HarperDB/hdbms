import React, { useCallback, useEffect } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';

import routes from './routes';
import SubNav from '../shared/subnav';
import appState from '../../state/appState';
import getCustomer from '../../api/lms/getCustomer';
import config from '../../../config';

export default () => {
  const { customer_id } = useParams();
  const hydratedRoutes = routes({ customer_id });
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id), [customer_id]);
  const auth = useStoreState(appState, (s) => s.auth);
  const isOrgOwner = isOrgUser?.status === 'owner';

  const refreshCustomer = useCallback(() => {
    if (auth && customer_id) {
      getCustomer({ auth, customer_id });
    }
  }, [auth, customer_id]);

  useEffect(() => refreshCustomer(), []);

  useInterval(() => refreshCustomer(), config.instances_refresh_rate);

  return isOrgOwner ? (
    <>
      <SubNav routes={hydratedRoutes} />
      <Switch>
        {hydratedRoutes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component} />
        ))}
        <Redirect to={`/${customer_id}/users`} />
      </Switch>
    </>
  ) : isOrgUser ? (
    <Redirect to={`/${customer_id}/instances`} />
  ) : (
    <Redirect to="/organizations" />
  );
};
