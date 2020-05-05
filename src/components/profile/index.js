import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import routes from './routes';
import SubNav from './subnav';

export default () => (
  <>
    <SubNav routes={routes} />
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} component={route.component} />
      ))}
      <Redirect to="/profile/profile" />
    </Switch>
  </>
);
