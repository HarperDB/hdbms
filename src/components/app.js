import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { positions, useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../functions/state/appState';
import usePersistedUser from '../functions/state/persistedUser';
import config from '../config';

import Loader from './shared/loader';
import Maintenance from './shared/maintenance';
import ErrorFallback from './shared/errorFallback';
import ErrorFallbackAuth from './shared/errorFallbackAuth';

import getProducts from '../functions/api/lms/getProducts';
import getRegions from '../functions/api/lms/getRegions';
import getCurrentVersion from '../functions/api/lms/getCurrentVersion';
import getPostManCollection from '../functions/examples/getPostManCollection';
import checkVersion from '../functions/app/checkVersion';
import init from '../functions/app/init';
import refreshUser from '../functions/app/refreshUser';
import changeFavIcon from '../functions/app/changeFavIcon';

const TopNav = lazy(() => import(/* webpackChunkName: "topnav" */ './topnav'));
const SignUp = lazy(() => import(/* webpackChunkName: "signUp" */ './auth/signUp'));
const SignIn = lazy(() => import(/* webpackChunkName: "signIn" */ './auth/signIn'));
const ResetPassword = lazy(() => import(/* webpackChunkName: "resetPassword" */ './auth/resetPassword'));
const UpdatePassword = lazy(() => import(/* webpackChunkName: "updatePassword" */ './auth/updatePassword'));
const ResendRegistrationEmail = lazy(() => import(/* webpackChunkName: "resendRegistrationEmail" */ './auth/resendRegistrationEmail'));
const Organization = lazy(() => import(/* webpackChunkName: "organization" */ './organization'));
const Organizations = lazy(() => import(/* webpackChunkName: "organizations" */ './organizations'));
const Resources = lazy(() => import(/* webpackChunkName: "resources" */ './resources'));
const Instances = lazy(() => import(/* webpackChunkName: "instances" */ './instances'));
const Instance = lazy(() => import(/* webpackChunkName: "instance" */ './instance'));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ './profile'));

const versionAlertOptions = { timeout: 0, position: positions.BOTTOM_CENTER };
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
  const [showVersionAlert, setShowVersionAlert] = useState(false);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const currentTheme = persistedUser?.theme;
  const showPasswordUpdate = auth?.user_id && auth?.update_password;
  const loggedIn = auth?.user_id;

  useEffect(() => {
    changeFavIcon(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    setShowVersionAlert(checkVersion({ apiVersion: version.studio }));
  }, [version.studio]);

  useEffect(() => {
    if (window.ORIBI && auth?.email) {
      window.ORIBI.api('setUserEmail', auth.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.email]);

  useEffect(() => {
    if (showVersionAlert) alert.info(`HarperDB Studio v${showVersionAlert} is now available. Refresh to update.`, versionAlertOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVersionAlert]);

  useEffect(() => {
    init({ auth: persistedUser, history, setFetchingUser, setPersistedUser, controller, showPasswordUpdate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    if (!products) getProducts();
    if (!regions) getRegions();
    if (!postmanCollection) getPostManCollection();
  }, config.refresh_content_interval);

  useInterval(() => {
    getCurrentVersion();
    refreshUser({ auth, showPasswordUpdate, controller, setFetchingUser });
  }, config.check_version_interval);

  return (
    <div className={persistedUser?.theme}>
      <div id="app-container">
        {config.maintenance ? (
          <ErrorBoundary FallbackComponent={ErrorFallbackAuth}>
            <Suspense fallback={<Loader header=" " spinner />}>
              <Maintenance />
            </Suspense>
          </ErrorBoundary>
        ) : showPasswordUpdate ? (
          <ErrorBoundary FallbackComponent={ErrorFallbackAuth}>
            <Suspense fallback={<Loader header=" " spinner />}>
              <UpdatePassword />
            </Suspense>
          </ErrorBoundary>
        ) : loggedIn ? (
          <>
            <Suspense fallback={<Loader header=" " spinner />}>
              <TopNav />
            </Suspense>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<Loader header=" " spinner />}>
                <Switch>
                  <Route component={Profile} path="/profile" />
                  <Route component={Resources} path="/resources/:view?" />
                  <Route component={Instance} path="/o/:customer_id/i/:compute_stack_id" />
                  <Route component={Instances} path="/o/:customer_id/instances/:action?/:purchaseStep?" />
                  <Route component={Organization} path="/o/:customer_id/:view?" />
                  <Route component={Organizations} path="/:list?/:action?" />
                  <Redirect to="/" />
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </>
        ) : fetchingUser ? (
          <Loader header="signing in" spinner />
        ) : (
          <ErrorBoundary FallbackComponent={ErrorFallbackAuth}>
            <Suspense fallback={<Loader header=" " spinner />}>
              <Switch>
                <Route component={SignIn} exact path="/" />
                <Route component={SignUp} exact path="/sign-up" />
                <Route component={ResetPassword} exact path="/reset-password" />
                <Route component={ResendRegistrationEmail} exact path="/resend-registration-email" />
                <Redirect to="/" />
              </Switch>
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
      <div id="app-bg-color" />
      <div id="app-bg-dots" />
    </div>
  );
};
