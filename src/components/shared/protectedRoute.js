import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';
import { useAlert } from 'react-alert';

import appState from '../../state/appState';
import config from '../../../config';

import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';
import getInstances from '../../api/lms/getInstances';
import getCurrentVersion from '../../api/lms/getCurrentVersion';
import getUser from '../../api/lms/getUser';
import AuthStateLoader from './authStateLoader';
import usePersistedUser from '../../state/persistedUser';
import getCustomer from '../../api/lms/getCustomer';

let shouldFetchHistoryListener = false;
let shouldFetchInstancesTimeout = false;
let shouldFetchUserTimeout = false;

const ProtectedRoute = ({ children }) => {
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const instances = useStoreState(appState, (s) => s.instances);
  const lastUpdate = useStoreState(appState, (s) => s.lastUpdate);
  const version = useStoreState(appState, (s) => s.version);
  const customer_id = useStoreState(appState, (s) => s.customer?.customer_id);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const [shouldFetchInstances, setShouldFetchInstances] = useState(true);
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

  const getCustomerIdFromURLOnReload = async () => {
    if (auth.orgs) {
      setPersistedUser({ ...persistedUser, email: auth.email, pass: auth.pass });
      const { pathname } = history.location;
      if (pathname && pathname.indexOf('/profile') === -1 && pathname.indexOf('/support') === -1 && pathname.indexOf('/organizations') === -1) {
        const [, customer_id_from_url] = pathname.split('/');
        getCustomer({ auth: persistedUser, customer_id: customer_id_from_url });
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

  const refreshInstances = async () => {
    const anInstanceIsLoading = instances && instances.find((i) => ['CREATE_IN_PROGRESS', 'DELETE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK'].includes(i.status));
    if (auth && products && regions && customer_id && (shouldFetchInstances || anInstanceIsLoading)) {
      setShouldFetchInstances(false);
      await getInstances({ auth, customer_id, products, regions, instanceCount: instances?.length });
      setShouldFetchInstances(true);
    }
  };

  const createHistoryListener = () => {
    shouldFetchHistoryListener = history.listen(() => {
      if (shouldFetchInstancesTimeout) clearTimeout(shouldFetchInstancesTimeout);
      setShouldFetchInstances(history.location.pathname.indexOf('/instance') !== -1);
      shouldFetchInstancesTimeout = setTimeout(() => setShouldFetchInstances(false), config.refresh_api_timeout);

      if (shouldFetchUserTimeout) clearTimeout(shouldFetchUserTimeout);
      shouldFetchUserTimeout = setTimeout(() => setShouldFetchUser(false), config.refresh_api_timeout);
    });
  };

  const clearHistoryListener = () => {
    clearTimeout(shouldFetchInstancesTimeout);
    clearTimeout(shouldFetchUserTimeout);
    setShouldFetchInstances(true);
    setShouldFetchUser(true);
    shouldFetchHistoryListener();
  };

  useAsyncEffect(logInFromPersistedUser, [auth.email, auth.pass, persistedUser.email, persistedUser.pass]);
  useAsyncEffect(getCustomerIdFromURLOnReload, [auth.orgs]);
  useAsyncEffect(createHistoryListener, clearHistoryListener, []);
  useAsyncEffect(refreshVersion, []);
  useAsyncEffect(refreshProducts, []);
  useAsyncEffect(refreshRegions, []);
  useAsyncEffect(refreshUser, []);
  useAsyncEffect(refreshInstances, [products, regions, customer_id, lastUpdate]);

  useInterval(refreshVersion, config.instances_refresh_rate);
  useInterval(refreshProducts, config.instances_refresh_rate);
  useInterval(refreshRegions, config.instances_refresh_rate);
  useInterval(refreshUser, config.instances_refresh_rate);
  useInterval(refreshInstances, config.instances_refresh_rate);

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
