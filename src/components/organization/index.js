import React, { Suspense, useEffect } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';

import routes from './routes';
import SubNav from '../shared/subnav';
import appState from '../../state/appState';
import getCustomer from '../../api/lms/getCustomer';
import config from '../../config';
import Loader from '../shared/loader';

export default () => {
  const { customer_id } = useParams();
  const hydratedRoutes = routes({ customer_id });
  const auth = useStoreState(appState, (s) => s.auth);
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id), [customer_id]);
  const isOrgOwner = isOrgUser?.status === 'owner';

  const refreshCustomer = () => {
    if (auth && customer_id) {
      getCustomer({ auth, customer_id });
    }
  };

  useEffect(refreshCustomer, []);

  useInterval(refreshCustomer, config.refresh_content_interval);

  return isOrgOwner ? (
    <>
      <SubNav routes={hydratedRoutes} />
      <Suspense fallback={<Loader header=" " spinner />}>
        <Switch>
          {hydratedRoutes.map((route) => (
            <Route key={route.path} path={route.path} component={route.component} />
          ))}
          <Redirect to={`/o/${customer_id}/users`} />
        </Switch>
      </Suspense>
    </>
  ) : isOrgUser ? (
    <Redirect to={`/o/${customer_id}/instances`} />
  ) : null;
};
