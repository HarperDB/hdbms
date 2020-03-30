import React, { useState } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';

import TopNav from '../topnav';
import Loader from './loader';
import appState from '../../state/stores/appState';
import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';
import getCustomer from '../../api/lms/getCustomer';
import getInstances from '../../api/lms/getInstances';
import usePersistedLMSAuth from '../../state/stores/persistedLMSAuth';

export default ({ component, path }) => {
  const { auth, products, regions, instances, lastUpdate } = useStoreState(appState, (s) => ({
    auth: s.auth,
    products: s.products,
    regions: s.regions,
    lastUpdate: s.lastUpdate,
    instances: s.instances,
  }));
  const { pathname } = useLocation();
  const history = useHistory();
  const [, setPersistedLMSAuth] = usePersistedLMSAuth({});
  const [fetching, setFetching] = useState(false);

  const logOut = () => {
    setPersistedLMSAuth(false);
    appState.update((s) => { s.auth = false; });
    setTimeout(() => history.push('/sign-in'), 0);
  };

  useAsyncEffect(() => {
    if (auth && !fetching) {
      getProducts();
      getRegions();
      getCustomer({ auth, payload: { customer_id: auth.customer_id } });
    }
  }, [])

  useAsyncEffect(async () => {
    if (auth && !fetching && products && regions) {
      setFetching(true);
      await getInstances({ auth, payload: { customer_id: auth?.customer_id }, entities: { products, regions } });
      setFetching(false);
    }
  }, [products, regions, lastUpdate]);

  return auth?.email && auth?.pass ? (
    <>
      <TopNav logOut={logOut} />
      {instances ? (
        <Route path={path} component={component} />
      ) : (
        <Loader message="loading instances" />
      )}

    </>
  ) : (
    <Redirect to={`/sign-in${pathname !== '/instances' ? `?returnURL=${pathname}` : ''}`} />
  );
};
