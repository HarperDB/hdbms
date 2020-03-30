import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import SignUp from './auth/signUp';
import SignIn from './auth/signIn';
import ResetPassword from './auth/resetPassword';
import UpdatePassword from './auth/updatePassword';
import ResendRegistrationEmail from './auth/resendRegistrationEmail';

import SignUpStandalone from './www.harperdb.io/signUpStandalone';
import Pricing from './www.harperdb.io/pricing';

import ProtectedRoute from './shared/protectedRoute';
import Account from './account';
import Instances from './instances';
import Instance from './instance';

export default () => (
  <div id="app-container">
    <Switch>
      <Route component={SignIn} exact path="/sign-in" />
      <Route component={SignUp} exact path="/sign-up" />
      <Route component={SignUpStandalone} exact path="/sign-up-standalone" />
      <Route component={Pricing} exact path="/pricing" />
      <Route component={UpdatePassword} exact path="/update-password" />
      <Route component={ResetPassword} exact path="/reset-password" />
      <Route component={ResendRegistrationEmail} exact path="/resend-registration-email" />
      <ProtectedRoute component={Instance} path="/instance/:compute_stack_id" />
      <ProtectedRoute component={Account} path="/account/:view?" />
      <ProtectedRoute component={Instances} path="/instances/:action?/:purchaseStep?" />
      <Redirect to="/sign-in" />
    </Switch>
  </div>
);
