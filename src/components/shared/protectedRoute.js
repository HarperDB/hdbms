import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';

import appState from '../../state/appState';
import config from '../../../config';

import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';
import getCurrentVersion from '../../api/lms/getCurrentVersion';
import getUser from '../../api/lms/getUser';
import AuthStateLoader from './authStateLoader';
import usePersistedUser from '../../state/persistedUser';
import getCustomer from '../../api/lms/getCustomer';

const ProtectedRoute = ({ children }) => {
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const version = useStoreState(appState, (s) => s.version);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const [shouldFetchUser, setShouldFetchUser] = useState(true);
  const [loggingIn, setLoggingIn] = useState(true);

  const refreshProducts = () => !products && getProducts();
  const refreshRegions = () => !regions && getRegions();
  const refreshVersion = () => !version && getCurrentVersion();

  const logInFromPersistedUser = async () => {
    if ((!auth.email || !auth.pass) && persistedUser.email && persistedUser.pass) {
      setLoggingIn(true);
      await getUser(persistedUser);
      setLoggingIn(false);
    } else if (!auth?.email || !auth?.pass) {
      history.push('/sign-in');
    } else {
      setLoggingIn(false);
    }
  };

  const getCustomerFromURLOnReload = async () => {
    if (auth.orgs) {
      setPersistedUser({ ...persistedUser, email: auth.email, pass: auth.pass });
      const { pathname } = history.location;
      if (!['/profile', '/support', '/organizations'].some((s) => pathname.includes(s))) {
        const [, customer_id_from_url] = pathname.split('/');
        getCustomer({ auth, customer_id: customer_id_from_url });
      }
    }
  };

  const refreshUser = async () => {
    if (auth?.email && auth?.pass && shouldFetchUser && !loggingIn) {
      setShouldFetchUser(false);
      await getUser(auth);
      setShouldFetchUser(true);
    }
  };

  useAsyncEffect(logInFromPersistedUser, [auth.email, auth.pass, persistedUser.email, persistedUser.pass]);
  useAsyncEffect(getCustomerFromURLOnReload, [auth.orgs]);
  useAsyncEffect(refreshVersion, []);
  useAsyncEffect(refreshProducts, []);
  useAsyncEffect(refreshRegions, []);
  useAsyncEffect(refreshUser, []);

  useInterval(refreshVersion, config.instances_refresh_rate);
  useInterval(refreshProducts, config.instances_refresh_rate);
  useInterval(refreshRegions, config.instances_refresh_rate);
  useInterval(refreshUser, config.instances_refresh_rate);

  return auth?.orgs ? (
    children
  ) : loggingIn ? (
    <div id="login-form">
      <AuthStateLoader header="loading organizations" spinner />
    </div>
  ) : (
    <Redirect to="/sign-in" />
  );
};

export default ProtectedRoute;
