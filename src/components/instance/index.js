import React, { useState, useEffect } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';

import appState from '../../state/appState';
import instanceState from '../../state/instanceState';
import useInstanceAuth from '../../state/instanceAuths';

import SubNav from './subnav';
import routes from './routes';
import buildActiveInstanceObject from '../../methods/instance/buildActiveInstanceObject';
import Loader from '../shared/loader';
import getInstances from '../../api/lms/getInstances';
import getCustomer from '../../api/lms/getCustomer';
import config from '../../../config';
import userInfo from '../../api/instance/userInfo';

export default () => {
  const { compute_stack_id, customer_id } = useParams();
  const [loadingInstance, setLoadingInstance] = useState(false);
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = instanceAuths && instanceAuths[compute_stack_id];
  const auth = useStoreState(appState, (s) => s.auth);
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id));
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const instances = useStoreState(appState, (s) => s.instances);
  const url = useStoreState(instanceState, (s) => s.url);
  const alert = useAlert();
  const history = useHistory();
  const hydratedRoutes = routes({ customer_id, super_user: instanceAuth?.super });
  const [mounted, setMounted] = useState(false);

  const refreshCustomer = () => {
    if (auth && customer_id) {
      getCustomer({ auth, customer_id });
    }
  };

  useEffect(refreshCustomer, []);

  const refreshUser = async () => {
    if (url) {
      const result = await userInfo({ auth: instanceAuth, url });
      if (result.error) {
        alert.error('Unable to connect to instance.');
        history.push(`/o/${customer_id}/instances`);
      } else {
        setInstanceAuths({ ...instanceAuths, [compute_stack_id]: { ...instanceAuth, super: result.role?.permission?.super_user } });
      }
    }
  };

  useAsyncEffect(refreshUser, []);

  useInterval(refreshUser, config.refresh_content_interval);

  const refreshInstances = () => {
    if (auth && products && regions && customer_id) {
      getInstances({ auth, customer_id, products, regions, instanceCount: instances?.length });
    }
  };

  useEffect(refreshInstances, [auth, products, regions, customer_id]);

  const refreshInstance = async () => {
    if (!instanceAuth) {
      alert.error('Please log into that instance');
      history.push(`/o/${customer_id}/instances`);
    } else if (instances) {
      const { error } = await buildActiveInstanceObject({ auth: instanceAuth, compute_stack_id, instances });
      setLoadingInstance(false);
      if (error) {
        setTimeout(() => history.push(`/o/${customer_id}/instances`), 10);
      }
    }
  };

  useEffect(() => {
    let cancelSub = () => false;
    if (compute_stack_id && instances && !loadingInstance) {
      setLoadingInstance(true);
      cancelSub = instanceState.subscribe(
        (s) => s.lastUpdate,
        () => refreshInstance()
      );
      setTimeout(refreshInstance, 250);
    }
    return () => cancelSub();
  }, [compute_stack_id, instances]);

  useEffect(() => {
    if (mounted && url && instanceAuth.super) {
      alert.success('Your instance user role has been upgraded to super_user');
    } else if (mounted && url) {
      alert.success('Your instance user role has been downgraded to standard');
    }
  }, [instanceAuth.super]);

  useAsyncEffect(
    () => setMounted(true),
    () => setMounted(false),
    []
  );

  return (
    <>
      <SubNav routes={hydratedRoutes} />
      {isOrgUser && instances && !loadingInstance ? (
        <Switch>
          {hydratedRoutes.map((route) => (
            <Route key={route.path} path={route.path} component={route.component} />
          ))}
        </Switch>
      ) : (
        <Loader message="loading instance" />
      )}
    </>
  );
};
