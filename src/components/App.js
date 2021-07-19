import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Route, Switch, Redirect, useHistory, useLocation } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { positions, useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';
import queryString from 'query-string';

import appState from '../functions/state/appState';
import usePersistedUser from '../functions/state/persistedUser';
import config from '../config';

import Loader from './shared/Loader';
import Maintenance from './shared/Maintenance';
import ErrorFallback from './shared/ErrorFallback';
import ErrorFallbackAuth from './shared/ErrorFallbackAuth';

import getProducts from '../functions/api/lms/getProducts';
import getRegions from '../functions/api/lms/getRegions';
import getCurrentVersion from '../functions/api/lms/getCurrentVersion';
import getPostManCollection from '../functions/examples/getPostManCollection';
import checkVersion from '../functions/app/checkVersion';
import init from '../functions/app/init';
import refreshUser from '../functions/app/refreshUser';
import changeFavIcon from '../functions/app/changeFavIcon';

const TopNav = lazy(() => import(/* webpackChunkName: "topnav" */ './TopNav'));
const SignUp = lazy(() => import(/* webpackChunkName: "signUp" */ './auth/SignUp'));
const SignIn = lazy(() => import(/* webpackChunkName: "signIn" */ './auth/SignIn'));
const ResetPassword = lazy(() => import(/* webpackChunkName: "resetPassword" */ './auth/ResetPassword'));
const UpdatePassword = lazy(() => import(/* webpackChunkName: "updatePassword" */ './auth/UpdatePassword'));
const Organization = lazy(() => import(/* webpackChunkName: "organization" */ './organization'));
const Organizations = lazy(() => import(/* webpackChunkName: "organizations" */ './organizations'));
const Resources = lazy(() => import(/* webpackChunkName: "resources" */ './resources'));
const Instances = lazy(() => import(/* webpackChunkName: "instances" */ './instances'));
const Instance = lazy(() => import(/* webpackChunkName: "instance" */ './instance'));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ './profile'));

const versionAlertOptions = { timeout: 0, position: positions.BOTTOM_CENTER };
let controller;

const App = () => {
  const history = useHistory();
  const alert = useAlert();
  const { search, pathname } = useLocation();
  const { redirect } = queryString.parse(search);
  const auth = useStoreState(appState, (s) => s.auth);
  const theme = useStoreState(appState, (s) => s.theme);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const version = useStoreState(appState, (s) => s.version);
  const postmanCollection = useStoreState(appState, (s) => s.postmanCollection);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [showVersionAlert, setShowVersionAlert] = useState(false);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const currentTheme = persistedUser?.theme;
  const loggedIn = auth?.user_id;
  const isNotEmployee = loggedIn && auth?.email.indexOf('harperdb.io') === -1 && auth?.email.indexOf('deliciousmonster.com') === -1;
  const isMaintenance = version?.maintenance && isNotEmployee;

  useEffect(() => {
    changeFavIcon(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    setShowVersionAlert(checkVersion({ apiVersion: version.studio }));
  }, [version.studio]);

  useEffect(() => {
    if (auth?.email) {
      if (window._kmq) {
        window._kmq.push(['identify', auth.email]);
      }
      if (auth?.update_password) {
        history.push('/update-password');
      }
      if (redirect) {
        history.push(redirect);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.email]);

  useEffect(() => {
    if (showVersionAlert) alert.info(`HarperDB Studio v${showVersionAlert} is now available. Refresh to update.`, versionAlertOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVersionAlert]);

  useEffect(() => {
    init({ auth: persistedUser, history, setFetchingUser, setPersistedUser, controller });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    if (!products) getProducts();
    if (!regions) getRegions();
    if (!postmanCollection) getPostManCollection();
  }, config.refresh_content_interval);

  useInterval(() => {
    getCurrentVersion();
    refreshUser({ auth, controller });
  }, config.check_version_interval);

  return (
    <div className={`${theme} ${config.maintenance ? 'maintenance' : ''}`}>
      <div id="app-container">
        <Suspense fallback={<Loader header=" " spinner />}>
          <TopNav isMaintenance={isMaintenance} />
        </Suspense>
        {fetchingUser ? (
          <Loader header="signing in" spinner />
        ) : loggedIn ? (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader header=" " spinner />}>
              <Switch>
                <Route component={isMaintenance ? Maintenance : UpdatePassword} path="/update-password" />
                <Route component={isMaintenance ? Maintenance : Profile} path="/profile" />
                <Route component={isMaintenance ? Maintenance : Resources} path="/resources/:view?" />
                <Route component={isMaintenance ? Maintenance : Instance} path="/o/:customer_id/i/:compute_stack_id" />
                <Route component={isMaintenance ? Maintenance : Instances} path="/o/:customer_id/instances/:action?/:purchaseStep?" />
                <Route component={isMaintenance ? Maintenance : Organization} path="/o/:customer_id/:view?" />
                <Route component={isMaintenance ? Maintenance : Organizations} path="/:list?/:action?" />
                <Redirect to="/" />
              </Switch>
            </Suspense>
          </ErrorBoundary>
        ) : (
          <ErrorBoundary FallbackComponent={ErrorFallbackAuth}>
            <Suspense fallback={<Loader header=" " spinner />}>
              <Switch>
                <Route component={SignIn} exact path="/" />
                <Route component={config.maintenance ? Maintenance : SignUp} exact path="/sign-up" />
                <Route component={isMaintenance ? Maintenance : ResetPassword} exact path="/reset-password" />
                <Route component={isMaintenance ? Maintenance : Resources} path="/resources/:view?" />
                <Redirect to={`/?redirect=${pathname}${search}`} />
              </Switch>
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
      <div id="app-bg-color" />
      <div id="app-bg-dots" />
      <div className="version">
        v{config.studio_version}
        {version.maintenance && ' - MAINTENANCE MODE'}
      </div>
    </div>
  );
};

export default App;
