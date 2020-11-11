import React, { Suspense } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import routes from './routes';
import SubNav from '../shared/subnav';
import appState from '../../functions/state/appState';
import Loader from '../shared/loader';

const OrganizationsIndex = () => {
  const { customer_id } = useParams();
  const hydratedRoutes = routes({ customer_id });
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id), [customer_id]);
  const isOrgOwner = isOrgUser?.status === 'owner';

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

export default OrganizationsIndex;
