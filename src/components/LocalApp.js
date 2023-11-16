import React, { useEffect, useState, lazy, Suspense } from 'react';

import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../functions/state/appState';
import usePersistedUser from '../functions/state/persistedUser';
import config from '../config';

import Loader from './shared/Loader';
import ErrorFallback from './shared/ErrorFallback';
import ErrorFallbackAuth from './shared/ErrorFallbackAuth';

import init from '../functions/app/init';
import changeFavIcon from '../functions/app/changeFavIcon';
import getThemes from '../functions/app/getThemes';
import useInstanceAuth from '../functions/state/instanceAuths';

const TopNav = lazy(() => import(/* webpackChunkName: "topnav" */ './TopNav'));
const Instance = lazy(() => import(/* webpackChunkName: "instance" */ './instance'));
const SignIn = lazy(() => import(/* webpackChunkName: "signIn" */ './auth/LocalSignIn'));

let controller;

function LocalApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { search, pathname } = location;
  const theme = useStoreState(appState, (s) => s.theme);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const currentTheme = persistedUser?.theme;
  const [instanceAuths] = useInstanceAuth({});
  const loggedIn = instanceAuths?.local?.valid;

  useEffect(() => {
    changeFavIcon(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    init({ auth: persistedUser, location, navigate, setFetchingUser, setPersistedUser, controller });
    getThemes(currentTheme);
    appState.update((s) => {
      s.instances = [{ compute_stack_id: 'local', url: 'http://localhost:9925', instance_name: 'local' }];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${theme}`}>
      <div id="app-container">
        <Suspense fallback={<Loader header=" " spinner />}>
          <TopNav loggedIn={loggedIn} />
        </Suspense>
        {fetchingUser ? (
          <Loader header="signing in" spinner />
        ) : loggedIn ? (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader header=" " spinner />}>
              {/* can we put instance routes in here, each in a suspense tag (since they're lazily loaded) */}
              <Routes>
                <Route element={<Instance />} path="/o/:customer_id/i/:compute_stack_id/*" />
                <Route element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        ) : (
          <ErrorBoundary FallbackComponent={ErrorFallbackAuth}>
            <Suspense fallback={<Loader header=" " spinner />}>
              <Routes>
                <Route element={<SignIn />} path="/" />
                <Route path="*" element={<Navigate to={`/?redirect=${pathname}${search}`} replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
      <div id="app-bg-color" />
      <div className="version">HarperDB Local Studio v{config.studio_version}</div>
    </div>
  );
}

export default LocalApp;
