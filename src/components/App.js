import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import ReactGA from 'react-ga';
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
import getWavelengthRegions from '../functions/api/lms/getWavelengthRegions';
import getCurrentVersion from '../functions/api/lms/getCurrentVersion';
import getPostManCollection from '../functions/examples/getPostManCollection';
import checkVersion from '../functions/app/checkVersion';
import init from '../functions/app/init';
import refreshUser from '../functions/app/refreshUser';
import changeFavIcon from '../functions/app/changeFavIcon';
import getThemes from '../functions/app/getThemes';

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


function ValidatedRoute (auth) {
    // ensure org id is valid for user. if not, redirect to organizations
    const { customer_id } = useParams();

    if (auth.auth.orgs.some(o => o.customer_id === customer_id)) {
        return <Outlet />;
    }
    return <Navigate to='/organization' replace />;

}

function App() {
  const canonicalUrl = document.querySelector('link[rel="canonical"]');
  const navigate = useNavigate();
  const alert = useAlert();
  const location =  useLocation();
  const { search, pathname } = location; 
  const { redirect } = queryString.parse(search);
  const auth = useStoreState(appState, (s) => s.auth);
  const theme = useStoreState(appState, (s) => s.theme);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const wavelengthRegions = useStoreState(appState, (s) => s.wavelengthRegions);
  const version = useStoreState(appState, (s) => s.version);
  const postmanCollection = useStoreState(appState, (s) => s.postmanCollection);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [showVersionAlert, setShowVersionAlert] = useState(false);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const currentTheme = persistedUser?.theme;
  const loggedIn = auth?.user_id;
  const isNotEmployee = loggedIn && auth?.email.indexOf('harperdb.io') === -1 && auth?.email.indexOf('deliciousmonster.com') === -1;
  const isMaintenance = version?.maintenance && isNotEmployee;

  ReactGA.initialize(config.google_analytics_code);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [location.pathname]);

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
        navigate('/update-password');
      }
      if (redirect) {
        navigate(redirect);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.email]);

  useEffect(() => {
    if (showVersionAlert) alert.info(`HarperDB Studio v${showVersionAlert} is now available. Refresh to update.`, versionAlertOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVersionAlert]);

  useEffect(() => {
    canonicalUrl.href = window.location.href;
  }, [location, canonicalUrl]);


  useEffect(() => {
 
    init({ auth: persistedUser, location, navigate, setFetchingUser, setPersistedUser, controller });
    getThemes(currentTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    if (!products) getProducts();
    if (!regions) getRegions();
    if (!wavelengthRegions) getWavelengthRegions();
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
              {/* can we put instance routes in here, each in a suspense tag (since they're lazily loaded) */}
              <Routes>
                <Route element={isMaintenance ? <Maintenance /> : <UpdatePassword />} path="/update-password" />
                <Route element={isMaintenance ? <Maintenance /> : <Profile />} path="/profile/*" />
                <Route element={isMaintenance ? <Maintenance /> : <Resources />} path="/resources/*" />
                <Route element={isMaintenance ? <Maintenance /> : <ValidatedRoute auth={auth} />}>
                    <Route element={<Instance />} path="/o/:customer_id/i/:compute_stack_id/*" />
                    <Route element={<Instances />} path="/o/:customer_id/instances/:action?/:purchaseStep?" />
                    <Route element={<Organization />} path="/o/:customer_id/*" />
                </Route>
                <Route element={isMaintenance ? <Maintenance /> : <Organizations />} path="/:list?/:action?" />
                <Route element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        ) : (
          <ErrorBoundary FallbackComponent={ErrorFallbackAuth}>
            <Suspense fallback={<Loader header=" " spinner />}>
              <Routes>
                <Route element={<SignIn />} path="/" />
                <Route element={config.maintenance ? <Maintenance /> : <SignUp />} path="/sign-up" />
                <Route element={isMaintenance ? <Maintenance /> : <ResetPassword />} path="/reset-password" />
                <Route element={isMaintenance ? <Maintenance /> : <Resources />} path="/resources/*" />
                <Route path="*" element={<Navigate to={`/?redirect=${pathname}${search}`} replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
      <div id="app-bg-color" />
      <div id="app-bg-dots" />
      <div className="version">
        HarperDB Studio v{config.studio_version}
        {version.maintenance && ' - MAINTENANCE MODE'}
      </div>
    </div>
  );
}

export default App;
