import React, { useCallback, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';

import appState from '../../state/appState';
import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';
import getInstances from '../../api/lms/getInstances';
import getCurrentVersion from '../../api/lms/getCurrentVersion';
import getUser from '../../api/lms/getUser';
import config from '../../../config';
import usePersistedUser from '../../state/persistedUser';

const ProtectedRoute = ({ children }) => {
  const { auth, products, regions, instances, customer_id, lastUpdate } = useStoreState(appState, (s) => ({
    auth: s.auth,
    products: s.products,
    customer_id: s.customer?.customer_id,
    regions: s.regions,
    lastUpdate: s.lastUpdate,
    instances: s.instances,
  }));
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const { pathname } = useLocation();
  const [fetching, setFetching] = useState(false);

  const refreshUsers = useCallback(async () => {
    if (auth && pathname !== '/organizations/new' && pathname !== '/instances/new') {
      const response = await getUser(auth);
      setPersistedUser({ ...persistedUser, ...response });
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

  return auth?.email && auth?.pass ? children : <Redirect to={`/sign-in${!['/'].includes(pathname) ? `?returnURL=${pathname}` : ''}`} />;
};

export default ProtectedRoute;
