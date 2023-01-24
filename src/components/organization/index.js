import React, { Suspense } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import routes from './routes';
import SubNav from '../shared/SubNav';
import appState from '../../functions/state/appState';
import Loader from '../shared/Loader';

function OrganizationIndex() {
  const location = useLocation();
  const { customer_id } = useParams();
  const hydratedRoutes = routes({ customer_id });
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id), [customer_id]);
  const isOrgOwner = isOrgUser?.status === 'owner';
  const primaryOrgId = useStoreState(appState, (s) => s.auth && s.auth?.orgs[0].customer_id);
  const primaryOrgRedirect = customer_id === 'primary' && `/o/${primaryOrgId}${location.pathname.split('primary')[1]}${location.search}`;

  return isOrgOwner ? (
    <main id="organization">
      <SubNav />
      <Suspense fallback={<Loader header=" " spinner />}>
        <Routes>
          {hydratedRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route element={ <Navigate to={`/o/${customer_id}/users`} replace /> } />
        </Routes>
      </Suspense>
    </main>
  ) : isOrgUser ? (
    <Navigate to={`/o/${customer_id}/instances`} replace />
  ) : primaryOrgRedirect ? (
    <Navigate to={primaryOrgRedirect} replace />
  ) : null;
}

export default OrganizationIndex;
