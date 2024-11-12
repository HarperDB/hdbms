import React, { useEffect, useState, lazy, Suspense } from 'react';

import { Route, Routes, Navigate, useNavigate, useLocation, Outlet, useParams, Link } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { positions, useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';
import queryString from 'query-string';
import { Col, Container, Row } from 'reactstrap';

import appState from '../../functions/state/appState';
import usePersistedUser from '../../functions/state/persistedUser';
import config from '../../config';

import Loader from '../shared/Loader';
import Maintenance from '../shared/Maintenance';
import ErrorFallback from '../shared/ErrorFallback';
import ErrorFallbackAuth from '../shared/ErrorFallbackAuth';

import getProducts from '../../functions/api/lms/getProducts';
import getRegions from '../../functions/api/lms/getRegions';
import getWavelengthRegions from '../../functions/api/lms/getWavelengthRegions';
import getCurrentVersion from '../../functions/api/lms/getCurrentVersion';
import checkVersion from '../../functions/app/checkVersion';
import init from '../../functions/app/init';
import refreshUser from '../../functions/app/refreshUser';
import changeFavIcon from '../../functions/app/changeFavIcon';
import getAkamaiRegions from '../../functions/api/lms/getAkamaiRegions';


const TopNav = lazy(() => import(/* webpackChunkName: "topnav" */ '../TopNav'));
const SignUp = lazy(() => import(/* webpackChunkName: "signUp" */ '../auth/SignUp'));
const SignIn = lazy(() => import(/* webpackChunkName: "signIn" */ '../auth/SignIn'));
const ResetPassword = lazy(() => import(/* webpackChunkName: "resetPassword" */ '../auth/ResetPassword'));
const UpdatePassword = lazy(() => import(/* webpackChunkName: "updatePassword" */ '../auth/UpdatePassword'));
const Organization = lazy(() => import(/* webpackChunkName: "organization" */ '../organization'));
const Organizations = lazy(() => import(/* webpackChunkName: "organizations" */ '../organizations'));
const Instances = lazy(() => import(/* webpackChunkName: "instances" */ '../instances'));
const Instance = lazy(() => import(/* webpackChunkName: "instance" */ '../instance'));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ '../profile'));

const versionAlertOptions = { timeout: 0, position: positions.BOTTOM_CENTER };
let controller;

function ValidatedRoute(auth) {
  // ensure org id is valid for user. if not, redirect to organizations
  const { customer_id } = useParams();

  if (auth.auth.orgs.some((o) => o.customer_id === customer_id)) {
    return <Outlet />;
  }
  return <Navigate to="/organization" replace />;
}

function App() {
  const canonicalUrl = document.querySelector('link[rel="canonical"]');
  const navigate = useNavigate();
  const alert = useAlert();
  const location = useLocation();
  const { search, pathname } = location;
  const { redirect } = queryString.parse(search);
  const auth = useStoreState(appState, (s) => s.auth);
  const theme = useStoreState(appState, (s) => s.theme);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const wavelengthRegions = useStoreState(appState, (s) => s.wavelengthRegions);
  const akamaiRegions = useStoreState(appState, (s) => s.akamaiRegions);
  const version = useStoreState(appState, (s) => s.version);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [showVersionAlert, setShowVersionAlert] = useState(false);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const loggedIn = auth?.user_id;
  const isNotEmployee = loggedIn && auth?.email.indexOf('harperdb.io') === -1 && auth?.email.indexOf('deliciousmonster.com') === -1;
  const isMaintenance = version?.maintenance && isNotEmployee;

  ReactGA.initialize(config.google_analytics_code);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
  }, [location.pathname]);

  useEffect(() => {
    changeFavIcon(persistedUser?.theme);
  }, [persistedUser?.theme]);

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
    // eslint-disable-next-line
  }, [auth?.email]);

  useEffect(() => {
    if (showVersionAlert) alert.info(`HarperDB Studio v${showVersionAlert} is now available. Refresh to update.`, versionAlertOptions);
    // eslint-disable-next-line
  }, [showVersionAlert]);

  useEffect(() => {
    canonicalUrl.href = window.location.href;
  }, [location, canonicalUrl]);

  useEffect(() => {
    init({ currentPath: location.pathname, navigate, persistedUser, setPersistedUser, setFetchingUser, controller });
    // eslint-disable-next-line
  }, []);

  useInterval(() => {
    if (!products) getProducts();
    if (!regions) getRegions();
    if (!wavelengthRegions) getWavelengthRegions();
    if (!akamaiRegions) getAkamaiRegions();
  }, config.refresh_content_interval);

  useInterval(() => {
    getCurrentVersion();
    refreshUser({ auth, controller });
  }, config.check_version_interval);

  return (
    <div className={`${theme} ${config.maintenance ? 'maintenance' : ''}`}>
      <Suspense fallback={<Loader header=" " spinner />}>
        <TopNav isMaintenance={isMaintenance} loggedIn={loggedIn} />
      </Suspense>
      {fetchingUser ? (
        <Loader header="signing in" spinner />
      ) : loggedIn ? (
        <main id="app-container">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader header=" " spinner />}>
              {/* can we put instance routes in here, each in a suspense tag (since they're lazily loaded) */}
              <Routes>
                <Route element={isMaintenance ? <Maintenance /> : <UpdatePassword />} path="/update-password" />
                <Route element={isMaintenance ? <Maintenance /> : <Profile />} path="/profile/*" />
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
        </main>
      ) : (
        <main className="auth-container">
          <ErrorBoundary FallbackComponent={ErrorFallbackAuth}>
            <Suspense fallback={<Loader header=" " spinner />}>
              <Container fluid="xs" className="h-100">
                <Row xs="1" sm="2" className="h-100">
                  <Col className="p-5 auth-studio-info d-none d-sm-flex justify-content-center align-items-center">
                    <div className='auth-studio-info-container'>
                      <h1 className="auth-title">HarperDB Studio</h1>
                      <span className="mb-4 auth-subtitle d-inline-block">Manage all your HarperDB instances.</span>
                      <ul className="auth-info-list-items">
                        <li>
                          <h3 className="item-title">Manage All Instances</h3>
                          <span className="item-subtitle">Set access, cluster, monitor, and more.</span>
                        </li>
                        <li>
                          <h3 className="item-title">Embedded API Server</h3>
                          <span className="item-subtitle">HarperDB components give you unlimited application flexibility.</span>
                        </li>
                        <li>
                          <h3 className="item-title">Fully Managed Cloud & 5G Instances</h3>
                          <span className="item-subtitle">Go from zero to code in minutes.</span>
                        </li>
                        <li>
                          <h3 className="item-title">Deploy Anywhere</h3>
                          <div className="mt-3">
                            <Link to={{ pathname: "https://hub.docker.com/r/harperdb/harperdb" }} target="_blank" rel="noreferrer" className="deploy-subitem">Docker</Link>
                            <Link to={{ pathname: "https://www.npmjs.com/package/harperdb" }} target="_blank" rel="noreferrer" className="deploy-subitem">npm</Link>
                            <Link to={{ pathname: "https://docs.harperdb.io/docs/deployments/install-harperdb" }} target="_blank" rel="noreferrer" className="deploy-subitem">all options</Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col className="p-5 d-flex justify-content-center align-items-center auth-form-container">
                    <Routes>
                      <Route element={<SignIn />} path="/" />
                      <Route element={config.maintenance ? <Maintenance /> : <SignUp />} path="/sign-up" />
                      <Route element={isMaintenance ? <Maintenance /> : <ResetPassword />} path="/reset-password" />
                      <Route path="*" element={<Navigate to={`/?redirect=${pathname}${search}`} replace />} />
                    </Routes>
                  </Col>
                </Row>
              </Container>
            </Suspense>
          </ErrorBoundary>
        </main>
      )}
      <div id="app-bg-color" />
      <div className="version">
        HarperDB Studio v{config.studio_version}
        {version.maintenance && ' - MAINTENANCE MODE'}
      </div>
    </div>
  );
}

export default App;
