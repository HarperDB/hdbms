import React, { useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import themeState from '../state/themeState';

import SignUp from './auth/signUp';
import SignIn from './auth/signIn';
import ResetPassword from './auth/resetPassword';
import UpdatePassword from './auth/updatePassword';
import ResendRegistrationEmail from './auth/resendRegistrationEmail';

import SignUpStandalone from './www/signUp';

import ProtectedRoute from './shared/protectedRoute';
import Account from './organization';
import Organizations from './organizations';
import Support from './support';
import Instances from './instances';
import Instance from './instance';
import Profile from './profile';
import TopNav from './topnav';

const App = () => {
  const [darkTheme] = themeState(false);
  const history = useHistory();
  const canonical = document.querySelector('link[rel="canonical"]');

  useEffect(() => history.listen(() => (canonical.href = window.location.href)), []);

  return (
    <div className={darkTheme ? 'dark' : ''}>
      <div id="app-container">
        <TopNav />
        <Switch>
          <Route component={SignIn} exact path="/sign-in" />
          <Route component={SignUp} exact path="/sign-up" />
          <Route component={SignUpStandalone} exact path="/sign-up-standalone" />
          <Route component={UpdatePassword} exact path="/update-password" />
          <Route component={ResetPassword} exact path="/reset-password" />
          <Route component={ResendRegistrationEmail} exact path="/resend-registration-email" />
          <ProtectedRoute>
            <Switch>
              <Route component={Organizations} path="/organizations/:action?" />
              <Route component={Instance} path="/instance/:compute_stack_id" />
              <Route component={Account} path="/organization/:view?" />
              <Route component={Profile} path="/profile/:view?" />
              <Route component={Support} path="/support/:view?" />
              <Route component={Instances} path="/instances/:action?/:purchaseStep?" />
            </Switch>
          </ProtectedRoute>
          <Redirect to="/sign-in" />
        </Switch>
      </div>
      <div id="app-bg-color" />
      <div id="app-bg-dots" />
    </div>
  );
};

export default App;
