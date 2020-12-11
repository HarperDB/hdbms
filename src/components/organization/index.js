import React, { Suspense } from 'react';
import { Redirect, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import routes from './routes';
import SubNav from '../shared/SubNav';
import appState from '../../functions/state/appState';
import Loader from '../shared/Loader';

const OrganizationsIndex = () => {
  const history = useHistory();
  const { customer_id } = useParams();
  const hydratedRoutes = routes({ customer_id });
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id), [customer_id]);
  const isOrgOwner = isOrgUser?.status === 'owner';
  const primaryOrgId = useStoreState(appState, (s) => s.auth && s.auth?.orgs[0].customer_id);
  const primaryOrgRedirect = customer_id === 'primary' && `/o/${primaryOrgId}${history.location.pathname.split('primary')[1]}${history.location.search}`;

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
  ) : primaryOrgRedirect ? (
    <Redirect to={primaryOrgRedirect} />
  ) : null;
};

export default OrganizationsIndex;
