import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import useLMS from '../../state/stores/lmsAuth';
import defaultLMSAuth from '../../state/defaults/defaultLMSAuth';

import TopNav from '../navs/topnav';
import Loader from './loader';
import appState from '../../state/stores/appState';
import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';
import getCustomer from '../../api/lms/getCustomer';
import getLicenses from '../../api/lms/getLicenses';
import getInstances from '../../api/lms/getInstances';

export default ({ component, path }) => {
  const [{ email, pass, customer_id }] = useLMS(defaultLMSAuth);
  const { products, regions, licenses, instances, lastUpdate } = useStoreState(appState, (s) => ({
    products: s.products,
    regions: s.regions,
    licenses: s.licenses,
    lastUpdate: s.lastUpdate,
    instances: s.instances,
  }));

  useEffect(() => {
    getProducts();
    getRegions();
    getCustomer({ auth: { email, pass }, payload: { customer_id } });
    getLicenses({ auth: { email, pass }, payload: { customer_id } });
  }, []);

  useEffect(() => {
    if (products && regions && licenses) {
      getInstances({ auth: { email, pass }, payload: { customer_id }, entities: { products, regions, licenses } });
    }
  }, [products, regions, licenses, lastUpdate]);

  return email && pass ? (
    <>
      <TopNav />
      {instances ? (
        <Route path={path} component={component} />
      ) : (
        <Loader />
      )}

    </>
  ) : (
    <Redirect to="/" />
  );
};
