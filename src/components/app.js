import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import SignUp from './auth/signUp';
import SignIn from './auth/signIn';
import ResetPassword from './auth/resetPassword';
import UpdatePassword from './auth/updatePassword';
import ResendRegistrationEmail from './auth/resendRegistrationEmail';

import SignUpStandalone from './www/signUp';
import Pricing from './www/pricing';

import ProtectedRoute from './shared/protectedRoute';
import Account from './account';
import Instances from './instances';
import Instance from './instance';
import TopNav from './topnav';

const App = () => (
  <div id="app-container">
    <TopNav />
    <Switch>
      <Route component={SignIn} exact path="/sign-in" />
      <Route component={SignUp} exact path="/sign-up" />
      <Route component={SignUpStandalone} exact path="/sign-up-standalone" />
      <Route component={Pricing} exact path="/pricing" />
      <Route component={UpdatePassword} exact path="/update-password" />
      <Route component={ResetPassword} exact path="/reset-password" />
      <Route component={ResendRegistrationEmail} exact path="/resend-registration-email" />
      <ProtectedRoute>
        <Switch>
          <Route component={Instance} path="/instance/:compute_stack_id" />
          <Route component={Account} path="/account/:view?" />
          <Route component={Instances} path="/instances/:action?/:purchaseStep?" />
        </Switch>
      </ProtectedRoute>
      <Redirect to="/sign-in" />
    </Switch>
  </div>
);

export default App;
