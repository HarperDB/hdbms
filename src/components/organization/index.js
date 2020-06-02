import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import routes from './routes';
import SubNav from '../shared/subnav';
import appState from '../../state/appState';

export default () => {
  const customer_id = useStoreState(appState, (s) => s.customer?.customer_id);
  const hydratedRoutes = routes({ customer_id });
  const { isOrgUser, isOrgOwner } = useStoreState(appState, (s) => {
    const userExists = s.auth.orgs.find((o) => o.customer_id.toString() === customer_id);
    return {
      isOrgUser: userExists,
      isOrgOwner: userExists?.status === 'owner',
    };
  });

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
