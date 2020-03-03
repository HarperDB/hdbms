import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import ProtectedRoute from './shared/protectedRoute';
import Instances from './instances';
import Instance from './instance';
import Register from './register';
import Login from './login';
import Account from './account';

export default () => (
  <div id="app-container">
    <Switch>
      <Route component={Login} exact path="/" />
      <Route component={Register} exact path="/register" />
      <ProtectedRoute component={Instance} path="/instances/:instance_id" />
      <ProtectedRoute component={Account} path="/account/:view?" />
      <ProtectedRoute component={Instances} path="/instances" />
      <Redirect to="/" />
    </Switch>
  </div>
);
