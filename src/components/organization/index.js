import React, { Suspense, useEffect } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';

import routes from './routes';
import SubNav from '../shared/subnav';
import appState from '../../functions/state/appState';
import getCustomer from '../../functions/api/lms/getCustomer';
import config from '../../config';
import Loader from '../shared/loader';
import getInstances from '../../functions/api/lms/getInstances';

export default () => {
  const { customer_id } = useParams();
  const hydratedRoutes = routes({ customer_id });
  const auth = useStoreState(appState, (s) => s.auth);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const instances = useStoreState(appState, (s) => s.instances);
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id), [customer_id]);
  const isOrgOwner = isOrgUser?.status === 'owner';

  const refreshCustomer = () => {
    if (auth && customer_id) {
      getCustomer({ auth, customer_id });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshCustomer, []);

  const refreshInstances = () => {
    if (auth && products && regions && customer_id) {
      getInstances({ auth, customer_id, products, regions, subscriptions: {}, instanceCount: instances?.length });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshInstances, [auth, products, regions, customer_id]);

  useInterval(refreshCustomer, config.refresh_content_interval);

  return isOrgOwner ? (
    <main id="organization">
      <SubNav routes={hydratedRoutes} />
      <Suspense fallback={<Loader header=" " spinner />}>
        <Switch>
          {hydratedRoutes.map((route) => (
            <Route key={route.path} path={route.path} component={route.component} />
          ))}
          <Redirect to={`/o/${customer_id}/users`} />
        </Switch>
      </Suspense>
    </main>
  ) : isOrgUser ? (
    <Redirect to={`/o/${customer_id}/instances`} />
  ) : null;
};
