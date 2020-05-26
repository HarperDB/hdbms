import React, { useCallback, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
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
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const { auth, products, regions, instances, customer_id, lastUpdate } = useStoreState(appState, (s) => ({
    auth: s.auth,
    products: s.products,
    customer_id: s.customer?.customer_id,
    regions: s.regions,
    lastUpdate: s.lastUpdate,
    instances: s.instances,
  }));
  const { pathname } = useLocation();
  const [fetching, setFetching] = useState(false);

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

  const refreshUsers = useCallback(async () => {
    if (auth && pathname !== '/organizations/new' && pathname !== '/instances/new' && pathname.indexOf('/instance/') === -1) {
      const response = await getUser(auth);
      if (!response.error) {
        appState.update((s) => {
          s.auth = { ...auth, ...response };
        });
      }
    }
  }, [auth, customer_id, pathname]);

  useAsyncEffect(() => {
    if (auth && !fetching) {
      getCurrentVersion();
      getProducts();
      getRegions();
      refreshUsers();
    }
  }, []);

  useAsyncEffect(async () => {
    if (auth && !fetching && products && regions && customer_id) {
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
  }, [products, regions, customer_id, lastUpdate]);

  useInterval(refreshUsers, config.instances_refresh_rate);

  return auth?.email && auth?.pass ? (
    <>
      <TopNav logOut={logOut} />
      {children}
    </>
  ) : (
    <Redirect to={`/sign-in${!['/'].includes(pathname) ? `?returnURL=${pathname}` : ''}`} />
  );
};

export default ProtectedRoute;
