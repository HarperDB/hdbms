import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { positions, useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../state/appState';
import usePersistedUser from '../state/persistedUser';
import config from '../config';

import SignUp from './auth/signUp';
import SignIn from './auth/signIn';
import ResetPassword from './auth/resetPassword';
import UpdatePassword from './auth/updatePassword';
import ResendRegistrationEmail from './auth/resendRegistrationEmail';

import getProducts from '../api/lms/getProducts';
import getRegions from '../api/lms/getRegions';
import getCurrentVersion from '../api/lms/getCurrentVersion';
import getPostManCollection from '../methods/examples/getPostManCollection';
import checkVersion from '../methods/app/checkVersion';
import init from '../methods/app/init';
import refreshUser from '../methods/app/refreshUser';

import Organization from './organization';
import Organizations from './organizations';
import Support from './support';
import Instances from './instances';
import Instance from './instance';
import Profile from './profile';
import TopNav from './topnav';
import Loader from './shared/loader';
import Maintenance from './shared/maintenance';
import ErrorFallback from './shared/errorFallback';
import ErrorFallbackAuth from './shared/errorFallbackAuth';

const versionAlertOptions = { timeout: 0, position: positions.BOTTOM_CENTER };

export default () => {
  const history = useHistory();
  const alert = useAlert();
  const auth = useStoreState(appState, (s) => s.auth);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const version = useStoreState(appState, (s) => s.version);
  const postmanCollection = useStoreState(appState, (s) => s.postmanCollection);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [showVersionAlert, setShowVersionAlert] = useState(false);
  const [persistedUser, setPersistedUser] = usePersistedUser({});

  const showPasswordUpdate = auth?.user_id && auth?.update_password;
  const loggedIn = auth?.user_id;
  let controller;

  useEffect(() => {
    setShowVersionAlert(checkVersion({ apiVersion: version.studio }));
  }, [version.studio]);

  useEffect(() => {
    if (showVersionAlert) alert.info(`HarperDB Studio v${showVersionAlert} is now available. Refresh to update.`, versionAlertOptions);
  }, [showVersionAlert]);

  useEffect(() => {
    init({ auth: persistedUser, history, setFetchingUser, setPersistedUser, controller, showPasswordUpdate });
  }, []);

  useInterval(() => {
    if (!products) getProducts();
    if (!regions) getRegions();
    if (!postmanCollection) getPostManCollection();
    refreshUser({ auth, showPasswordUpdate, controller, setFetchingUser });
  }, config.refresh_content_interval);

  useInterval(() => getCurrentVersion(), config.check_version_interval);

  return (
    <div className={persistedUser?.darkTheme ? 'dark' : ''}>
      <div id="app-container">
        {config.maintenance ? (
          <ErrorBoundary FallbackComponent={ErrorFallbackAuth}>
            <Maintenance />
          </ErrorBoundary>
        ) : showPasswordUpdate ? (
          <ErrorBoundary FallbackComponent={ErrorFallbackAuth}>
            <UpdatePassword />
          </ErrorBoundary>
        ) : loggedIn ? (
          <>
            <TopNav />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Switch>
                <Route component={Profile} path="/profile" />
                <Route component={Support} path="/support/:view?" />
                <Route component={Instance} path="/o/:customer_id/i/:compute_stack_id" />
                <Route component={Instances} path="/o/:customer_id/instances/:action?/:purchaseStep?" />
                <Route component={Organization} path="/o/:customer_id/:view?" />
                <Route component={Organizations} path="/:action?" />
                <Redirect to="/" />
              </Switch>
            </ErrorBoundary>
          </>
        ) : fetchingUser ? (
          <Loader header="signing in" spinner />
        ) : (
          <ErrorBoundary FallbackComponent={ErrorFallbackAuth}>
            <Switch>
              <Route component={SignIn} exact path="/" />
              <Route component={SignUp} exact path="/sign-up" />
              <Route component={ResetPassword} exact path="/reset-password" />
              <Route component={ResendRegistrationEmail} exact path="/resend-registration-email" />
              <Redirect to="/" />
            </Switch>
          </ErrorBoundary>
        )}
      </div>
      <div id="app-bg-color" />
      <div id="app-bg-dots" />
    </div>
  );
};
