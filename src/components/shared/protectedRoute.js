import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';

import appState from '../../state/appState';
import config from '../../../config';

import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';
import getInstances from '../../api/lms/getInstances';
import getCurrentVersion from '../../api/lms/getCurrentVersion';
import getUser from '../../api/lms/getUser';

let shouldFetchHistoryListener = false;
let shouldFetchInstancesTimeout = false;
let shouldFetchUserTimeout = false;

const ProtectedRoute = ({ children }) => {
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const instances = useStoreState(appState, (s) => s.instances);
  const customer_id = useStoreState(appState, (s) => s.customer?.customer_id);
  const lastUpdate = useStoreState(appState, (s) => s.lastUpdate);
  const version = useStoreState(appState, (s) => s.version);
  const [shouldFetchInstances, setShouldFetchInstances] = useState(true);
  const [shouldFetchUser, setShouldFetchUser] = useState(true);

  const redirectURL = `/sign-in${!['/'].includes(history.location.pathname) ? `?returnURL=${history.location.pathname}` : ''}`;
  const showRoute = auth?.email && auth?.pass;

  const refreshProducts = () => !products && getProducts();
  const refreshRegions = () => !regions && getRegions();
  const refreshVersion = () => !version && getCurrentVersion();

  const refreshUser = async () => {
    if (auth && shouldFetchUser) {
      setShouldFetchUser(false);
      const response = await getUser(auth);
      if (!response.error) {
        appState.update((s) => {
          s.auth = { ...auth, ...response };
        });
      }
      setShouldFetchUser(true);
    }
  };

  const refreshInstances = async () => {
    const anInstanceIsLoading = instances && instances.find((i) => ['CREATE_IN_PROGRESS', 'DELETE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK'].includes(i.status));
    const canFetchInstances = auth && products && regions && customer_id;
    const shouldRefreshInstances = canFetchInstances && (shouldFetchInstances || anInstanceIsLoading);
    if (shouldRefreshInstances) {
      setShouldFetchInstances(false);
      await getInstances({ auth, customer_id, products, regions, instanceCount: instances?.length });
      setShouldFetchInstances(true);
    }
  };

  useAsyncEffect(
    () => {
      shouldFetchHistoryListener = history.listen(() => {
        if (shouldFetchInstancesTimeout) clearTimeout(shouldFetchInstancesTimeout);
        setShouldFetchInstances(history.location.pathname.indexOf('/instance') !== -1);
        shouldFetchInstancesTimeout = setTimeout(() => setShouldFetchInstances(false), config.instances_refresh_timeout);

        if (shouldFetchUserTimeout) clearTimeout(shouldFetchUserTimeout);
        setShouldFetchUser(history.location.pathname.indexOf('/organizations') !== -1);
        shouldFetchUserTimeout = setTimeout(() => setShouldFetchUser(false), config.instances_refresh_timeout);
      });
    },
    () => {
      clearTimeout(shouldFetchInstancesTimeout);
      clearTimeout(shouldFetchUserTimeout);
      shouldFetchHistoryListener();
    },
    []
  );

  useAsyncEffect(refreshVersion, []);
  useAsyncEffect(refreshProducts, []);
  useAsyncEffect(refreshRegions, []);
  useAsyncEffect(refreshUser, []);
  useAsyncEffect(refreshInstances, []);
  useAsyncEffect(refreshInstances, [products, regions, customer_id, lastUpdate]);

  useInterval(refreshInstances, config.instances_refresh_rate);
  useInterval(refreshVersion, config.instances_refresh_rate);
  useInterval(refreshProducts, config.instances_refresh_rate);
  useInterval(refreshRegions, config.instances_refresh_rate);
  useInterval(refreshUser, config.instances_refresh_rate);

  return showRoute ? children : <Redirect to={redirectURL} />;
};

export default ProtectedRoute;
