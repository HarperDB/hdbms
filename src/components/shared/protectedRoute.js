import React, { useCallback, useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';

import appState from '../../state/appState';
import usePersistedUser from '../../state/persistedUser';

import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';
import getInstances from '../../api/lms/getInstances';
import getCurrentVersion from '../../api/lms/getCurrentVersion';
import getUser from '../../api/lms/getUser';
import config from '../../../config';
import TopNav from '../topnav';

const ProtectedRoute = ({ children }) => {
  const history = useHistory();
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const { auth, products, regions, instances, customer_id, lastUpdate, version } = useStoreState(appState, (s) => ({
    auth: s.auth,
    products: s.products,
    customer_id: s.customer?.customer_id,
    regions: s.regions,
    lastUpdate: s.lastUpdate,
    instances: s.instances,
    version: s.version,
  }));
  const [fetching, setFetching] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  let shouldFetchTimeout = false;

  useEffect(
    () =>
      history.listen(() => {
        setShouldFetch(history.location.pathname.indexOf('/organizations/new') === -1 && history.location.pathname.indexOf('/instances/new') === -1);
        clearTimeout(shouldFetchTimeout);
        shouldFetchTimeout = setTimeout(() => setShouldFetch(false), config.instances_refresh_timeout);
      }),
    []
  );

  const logOut = useCallback(() => {
    setPersistedUser({ darkTheme: persistedUser.darkTheme });
    appState.update((s) => {
      s.auth = false;
      s.customer = false;
      s.users = false;
      s.instances = false;
      s.hasCard = false;
      s.lastUpdate = false;
    });
  }, [persistedUser.darkTheme]);

  const refreshUser = async () => {
    if (auth && shouldFetch) {
      const response = await getUser(auth);
      if (!response.error) {
        appState.update((s) => {
          s.auth = { ...auth, ...response };
        });
      }
    }
  };

  const refreshInstances = async () => {
    if (auth && shouldFetch && !fetching && products && regions && customer_id) {
      setFetching(true);
      await getInstances({
        auth,
        customer_id,
        products,
        regions,
        instanceCount: instances?.length,
      });
      setFetching(false);
    }
  };

  const refreshProducts = () => !products && getProducts();

  const refreshRegions = () => !regions && getRegions();

  const refreshVersion = () => !version && getCurrentVersion();

  useAsyncEffect(() => {
    if (auth && !fetching) {
      refreshVersion();
      refreshProducts();
      refreshRegions();
      refreshUser();
    }
  }, []);

  useAsyncEffect(refreshInstances, [products, regions, customer_id, lastUpdate]);

  useInterval(() => {
    refreshInstances();
    refreshVersion();
    refreshProducts();
    refreshRegions();
    refreshUser();
  }, config.instances_refresh_rate);

  return auth?.email && auth?.pass ? (
    <>
      <TopNav logOut={logOut} />
      {children}
    </>
  ) : (
    <Redirect to={`/sign-in${!['/'].includes(history.location.pathname) ? `?returnURL=${history.location.pathname}` : ''}`} />
  );
};

export default ProtectedRoute;
