import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Instances from './instances';
import Instance from './instance';
import Login from './login';

export default () => (
  <div id="app-container">
    <Switch>
      <Route component={Instance} path="/instances/:instance_id" />
      <Route component={Instances} path="/instances" />
      <Route component={Login} exact path="/" />
      <Redirect to="/" />
    </Switch>
  </div>
);
