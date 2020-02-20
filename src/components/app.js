import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Instances from './instances';
import Instance from './instance';
import Login from './login';
import useLMS from '../stores/lmsData';

export default () => {
  const [lmsData] = useLMS({ auth: false, instances: [] });

  return (
    <div id="app-container">
      <Switch>
        <Route component={Instance} path="/instances/:instance_id" />
        <Route render={() => (lmsData && lmsData.instances ? <Instances lmsData={lmsData} /> : <Redirect to="/" />)} path="/instances" />
        <Route component={Login} exact path="/" />
        <Redirect to="/" />
      </Switch>
    </div>
  );
}
