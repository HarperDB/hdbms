import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// context
import { HarperDBContext } from './providers/harperdb';

// layouts
import AuthLayout from './layouts/auth';
import DocsLayout from './layouts/docs';
import InstanceLayout from './layouts/instance';

// pages
import Login from './pages/login';
import Welcome from './pages/docs/welcome';
import GettingStarted from './pages/docs/gettingstarted';
import Examples from './pages/docs/examples';
import Browse from './pages/instance/browse';
import Clustering from './pages/instance/clustering';
import Configuration from './pages/instance/configuration';
import Enterprise from './pages/instance/enterprise';

// protected route
import ProtectedRoute from './components/protectedRoute';

// routes
const AuthRoutes = () => (
  <AuthLayout>
    <Route path="/login" component={Login} />
  </AuthLayout>
);

const DocsRoutes = () => (
  <DocsLayout>
    <Switch>
      <Route path="/docs/welcome" component={Welcome} />
      <Route path="/docs/gettingstarted" component={GettingStarted} />
      <Route path="/docs/examples" component={Examples} />
      <Redirect to="/docs/welcome" />
    </Switch>
  </DocsLayout>
);

const InstanceRoutes = () => (
  <InstanceLayout>
    <Switch>
      <Route path="/instances/default/browse/:schema?/:table?/:action?/:hash?" component={Browse} />
      <Route path="/instances/default/clustering" component={Clustering} />
      <Route path="/instances/default/configuration" component={Configuration} />
      <Route path="/instances/default/enterprise" component={Enterprise} />
      <Redirect to="/instances/default/browse/:schema?/:table?/:action?/:hash?" />
    </Switch>
  </InstanceLayout>
);

export default () => {
  const { structure } = useContext(HarperDBContext);
  return (
    <Switch>
      <Route exact path="/" render={() => (structure ? <Redirect to="/instances/default/browse/:schema?/:table?/:action?/:hash?" /> : <Redirect to="/login" />)} />
      <ProtectedRoute path="/instances" loggedIn={!!structure} component={InstanceRoutes} />
      <Route path="/docs" component={DocsRoutes} />
      <Route path="/" component={AuthRoutes} />
    </Switch>
  );
};
