import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import routes from './routes';
import SubNav from '../shared/subnav';
import Loader from '../shared/loader';

export default () => (
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
