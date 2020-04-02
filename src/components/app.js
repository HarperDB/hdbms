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
import ComingSoon from './comingSoon';

const showComingSoon = window.location.host === 'studio.harperdb.io';

export default () => (
  <div id="app-container">
    <Switch>
      <Route component={showComingSoon ? ComingSoon : SignIn} exact path="/sign-in" />
      <Route component={showComingSoon ? ComingSoon : SignUp} exact path="/sign-up" />
      <Route component={SignUpStandalone} exact path="/sign-up-standalone" />
      <Route component={Pricing} exact path="/pricing" />
      <Route component={showComingSoon ? ComingSoon : UpdatePassword} exact path="/update-password" />
      <Route component={showComingSoon ? ComingSoon : ResetPassword} exact path="/reset-password" />
      <Route component={showComingSoon ? ComingSoon : ResendRegistrationEmail} exact path="/resend-registration-email" />
      <ProtectedRoute component={showComingSoon ? ComingSoon : Instance} path="/instance/:compute_stack_id" />
      <ProtectedRoute component={showComingSoon ? ComingSoon : Account} path="/account/:view?" />
      <ProtectedRoute component={showComingSoon ? ComingSoon : Instances} path="/instances/:action?/:purchaseStep?" />
      <Redirect to="/sign-in" />
    </Switch>
  </div>
);
