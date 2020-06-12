import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';

import appState from '../state/appState';
import usePersistedUser from '../state/persistedUser';

import SignUp from './auth/signUp';
import SignIn from './auth/signIn';
import ResetPassword from './auth/resetPassword';
import UpdatePassword from './auth/updatePassword';
import ResendRegistrationEmail from './auth/resendRegistrationEmail';

import Organization from './organization';
import Organizations from './organizations';
import Support from './support';
import Instances from './instances';
import Instance from './instance';
import Profile from './profile';
import TopNav from './topnav';
import getProducts from '../api/lms/getProducts';
import getRegions from '../api/lms/getRegions';
import getCurrentVersion from '../api/lms/getCurrentVersion';
import config from '../../config';
import getUser from '../api/lms/getUser';
import Loader from './shared/loader';

let controller;

export default () => {
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const version = useStoreState(appState, (s) => s.version);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const canonical = document.querySelector('link[rel="canonical"]');
  const showPasswordUpdate = auth?.user_id && auth?.update_password;
  const loggedIn = auth?.user_id;

  const refreshProducts = () => !products && getProducts();
  const refreshRegions = () => !regions && getRegions();
  const refreshVersion = () => !version && getCurrentVersion();
  const refreshUser = async ({ email, pass }) => {
    if (email && pass) {
      controller = new AbortController();
      setFetchingUser(true);
      await getUser({ email, pass, signal: controller.signal });
      setFetchingUser(false);
    }
  };

  useEffect(() => {
    history.listen(() => (canonical.href = window.location.href));

    if (!persistedUser?.email) {
      setFetchingUser(false);
    } else {
      refreshUser(persistedUser);
    }

    refreshVersion();
    refreshProducts();
    refreshRegions();

    const unsubscribeAuth = appState.subscribe(
      (s) => ({ newAuth: s.auth, newDarkTheme: s.darkTheme }),
      ({ newAuth: { email, pass }, newDarkTheme }) => {
        setPersistedUser({ email, pass, darkTheme: newDarkTheme });
        if (!email && controller) controller.abort();
      }
    );

    appState.update((s) => {
      s.auth = { email: persistedUser?.email, pass: persistedUser?.pass };
      s.darkTheme = persistedUser?.darkTheme;
    });

    return unsubscribeAuth;
  }, []);

  useInterval(() => {
    refreshVersion();
    refreshProducts();
    refreshRegions();
    refreshUser(auth);
  }, config.instances_refresh_rate);

  return (
    <div className={persistedUser?.darkTheme ? 'dark' : ''}>
      <div id="app-container">
        {showPasswordUpdate ? (
          <UpdatePassword />
        ) : loggedIn ? (
          <>
            <TopNav />
            <Switch>
              <Route component={Profile} path="/profile" />
              <Route component={Support} path="/support/:view?" />
              <Route component={Instance} path="/o/:customer_id/i/:compute_stack_id" />
              <Route component={Instances} path="/o/:customer_id/instances/:action?/:purchaseStep?" />
              <Route component={Organization} path="/o/:customer_id/:view?" />
              <Route component={Organizations} path="/:action?" />
              <Redirect to="/" />
            </Switch>
          </>
        ) : fetchingUser ? (
          <Loader message="signing in" />
        ) : (
          <Switch>
            <Route component={SignIn} exact path="/" />
            <Route component={SignUp} exact path="/sign-up" />
            <Route component={ResetPassword} exact path="/reset-password" />
            <Route component={ResendRegistrationEmail} exact path="/resend-registration-email" />
            <Redirect to="/" />
          </Switch>
        )}
      </div>
      <div id="app-bg-color" />
      <div id="app-bg-dots" />
    </div>
  );
};
