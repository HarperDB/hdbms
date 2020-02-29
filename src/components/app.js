import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Instances from './instances';
import Instance from './instance';
import Login from './login';
import Account from './account';
import TopNav from './navs/topnav';

export default () => (
  <div id="app-container">
    <TopNav />
    <Switch>
      <Route component={Instance} path="/instances/:instance_id" />
      <Route component={Account} path="/account/:view?" />
      <Route component={Instances} path="/instances" />
      <Route component={Login} exact path="/" />
      <Redirect to="/" />
    </Switch>
  </div>
);
