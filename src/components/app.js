import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { useAlert, positions } from 'react-alert';

import appState from '../state/appState';
import usePersistedUser from '../state/persistedUser';

import config from '../../config';

import SignUp from './auth/signUp';
import SignIn from './auth/signIn';
import ResetPassword from './auth/resetPassword';
import UpdatePassword from './auth/updatePassword';
import ResendRegistrationEmail from './auth/resendRegistrationEmail';

import getProducts from '../api/lms/getProducts';
import getRegions from '../api/lms/getRegions';
import getCurrentVersion from '../api/lms/getCurrentVersion';
import getUser from '../api/lms/getUser';
import getPostManCollection from '../methods/examples/getPostManCollection';

import Organization from './organization';
import Organizations from './organizations';
import Support from './support';
import Instances from './instances';
import Instance from './instance';
import Profile from './profile';
import TopNav from './topnav';
import Loader from './shared/loader';
import Maintenance from './shared/maintenance';

let controller;

export default () => {
  const history = useHistory();
  const alert = useAlert();
  const auth = useStoreState(appState, (s) => s.auth);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const version = useStoreState(appState, (s) => s.version);
  const postmanCollection = useStoreState(appState, (s) => s.postmanCollection);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const canonical = document.querySelector('link[rel="canonical"]');
  const showPasswordUpdate = auth?.user_id && auth?.update_password;
  const loggedIn = auth?.user_id;

  const refreshProducts = () => !products && getProducts();
  const refreshRegions = () => !regions && getRegions();
  const refreshPostmanCollection = () => !postmanCollection && getPostManCollection();
  const refreshVersion = () => getCurrentVersion();

  const refreshUser = async ({ email, pass }) => {
    if (email && pass && !showPasswordUpdate) {
      controller = new AbortController();
      setFetchingUser(true);
      await getUser({ email, pass, signal: controller.signal });
      setFetchingUser(false);
    }
  };

  useEffect(() => {
    if (version.studio && config.studio_version !== version.studio) {
      alert.info(`HarperDB Studio v${version.studio} is now available. Refresh to update.`, { timeout: 0, position: positions.BOTTOM_CENTER });
    }
  }, [config.studio_version, version.studio]);

  useEffect(() => {
    history.listen(() => (canonical.href = window.location.href));

    if (['/sign-up', '/reset-password', '/resend-registration-email'].includes(history.location.pathname)) {
      setFetchingUser(false);
      return setPersistedUser({});
    }

    if (['/sign-in'].includes(history.location.pathname)) {
      history.push('/');
    }

    if (!persistedUser?.email) {
      setFetchingUser(false);
    } else {
      refreshUser(persistedUser);
    }

    refreshVersion();
    refreshProducts();
    refreshRegions();
    refreshPostmanCollection();

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
    refreshProducts();
    refreshRegions();
    refreshPostmanCollection();
    refreshUser(auth);
  }, config.refresh_content_interval);

  useInterval(() => refreshVersion(), config.check_version_interval);

  return (
    <div className={persistedUser?.darkTheme ? 'dark' : ''}>
      <div id="app-container">
        {config.maintenance ? (
          <Maintenance />
        ) : showPasswordUpdate ? (
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
