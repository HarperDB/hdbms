import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import routes from './routes';
import SubNav from '../shared/SubNav';
import Loader from '../shared/Loader';

const ProfileIndex = () => (
  <>
    <SubNav routes={routes} />
    <Suspense fallback={<Loader header=" " spinner />}>
      <Switch>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component} />
        ))}
        <Redirect to="/profile/profile" />
      </Switch>
    </Suspense>
  </>
);

export default ProfileIndex;
