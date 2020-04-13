import React, { useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';

import Loader from './loader';
import appState from '../../state/appState';
import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';
import getCustomer from '../../api/lms/getCustomer';
import getInstances from '../../api/lms/getInstances';

const ProtectedRoute = ({ children }) => {
  const { auth, products, regions, instances, lastUpdate } = useStoreState(appState, (s) => ({
    auth: s.auth,
    products: s.products,
    regions: s.regions,
    lastUpdate: s.lastUpdate,
    instances: s.instances,
  }));
  const { pathname } = useLocation();
  const [fetching, setFetching] = useState(false);

  useAsyncEffect(() => {
    if (auth && !fetching) {
      getProducts();
      getRegions();
      getCustomer({
        auth,
        payload: {
          customer_id: auth.customer_id,
        },
      });
    }
  }, []);

  useAsyncEffect(async () => {
    if (auth && !fetching && products && regions) {
      setFetching(true);
      await getInstances({
        auth,
        customer_id: auth?.customer_id,
        products,
        regions,
        instanceCount: instances?.length,
      });
      setFetching(false);
    }
  }, [products, regions, lastUpdate]);

  return auth?.email && auth?.pass ? (
    <>{instances ? children : <Loader message="loading instances" />}</>
  ) : (
    <Redirect to={`/sign-in${!['/', '/instances'].includes(pathname) ? `?returnURL=${pathname}` : ''}`} />
  );
};

export default ProtectedRoute;
