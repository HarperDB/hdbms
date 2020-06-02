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
let shouldFetchTimeout = false;

const ProtectedRoute = ({ children }) => {
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const instances = useStoreState(appState, (s) => s.instances);
  const customer_id = useStoreState(appState, (s) => s.customer?.customer_id);
  const lastUpdate = useStoreState(appState, (s) => s.lastUpdate);
  const version = useStoreState(appState, (s) => s.version);
  const [fetching, setFetching] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);

  const redirectURL = `/sign-in${!['/'].includes(history.location.pathname) ? `?returnURL=${history.location.pathname}` : ''}`;
  const showRoute = auth?.email && auth?.pass;

  const refreshProducts = () => !products && getProducts();
  const refreshRegions = () => !regions && getRegions();
  const refreshVersion = () => !version && getCurrentVersion();

  const refreshUser = async () => {
    if (auth) {
      const response = await getUser(auth);
      if (!response.error) {
        appState.update((s) => {
          s.auth = { ...auth, ...response };
        });
      }
    }
  };

  const refreshInstances = async () => {
    const anInstanceIsLoading = instances && instances.find((i) => ['CREATE_IN_PROGRESS', 'DELETE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK'].includes(i.status));
    const canFetchInstances = auth && products && regions && customer_id;
    const shouldRefreshInstances = canFetchInstances && (shouldFetch || anInstanceIsLoading) && !fetching;
    if (shouldRefreshInstances) {
      setFetching(true);
      await getInstances({ auth, customer_id, products, regions, instanceCount: instances?.length });
      setFetching(false);
    }
  };

  useAsyncEffect(
    () => {
      shouldFetchHistoryListener = history.listen(() => {
        if (shouldFetchTimeout) clearTimeout(shouldFetchTimeout);
        setShouldFetch(history.location.pathname.indexOf('/instance') !== -1);
        shouldFetchTimeout = setTimeout(() => setShouldFetch(false), config.instances_refresh_timeout);
      });
    },
    () => {
      clearTimeout(shouldFetchTimeout);
      shouldFetchHistoryListener();
    },
    []
  );

  useAsyncEffect(refreshVersion, []);
  useAsyncEffect(refreshProducts, []);
  useAsyncEffect(refreshRegions, []);
  useAsyncEffect(refreshUser, []);
  useAsyncEffect(refreshInstances, [products, regions, customer_id, lastUpdate]);

  useInterval(refreshInstances, config.instances_refresh_rate);
  useInterval(refreshVersion, config.instances_refresh_rate);
  useInterval(refreshProducts, config.instances_refresh_rate);
  useInterval(refreshRegions, config.instances_refresh_rate);
  useInterval(refreshUser, config.instances_refresh_rate);

  return showRoute ? children : <Redirect to={redirectURL} />;
};

export default ProtectedRoute;
