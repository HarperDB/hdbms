import React, { useState, useEffect, Suspense } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';

import appState from '../../functions/state/appState';
import instanceState from '../../functions/state/instanceState';
import useInstanceAuth from '../../functions/state/instanceAuths';

import SubNav from './subnav';
import routes from './routes';
import buildActiveInstanceObject from '../../functions/instance/buildActiveInstanceObject';
import Loader from '../shared/loader';
import getInstances from '../../functions/api/lms/getInstances';
import getCustomer from '../../functions/api/lms/getCustomer';
import config from '../../config';
import userInfo from '../../functions/api/instance/userInfo';
import getPrepaidSubscriptions from '../../functions/api/lms/getPrepaidSubscriptions';

const InstanceIndex = () => {
  const { compute_stack_id, customer_id } = useParams();
  const [loadingInstance, setLoadingInstance] = useState(false);
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = instanceAuths && instanceAuths[compute_stack_id];
  const auth = useStoreState(appState, (s) => s.auth);
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id));
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const subscriptions = useStoreState(appState, (s) => s.subscriptions);
  const instances = useStoreState(appState, (s) => s.instances);
  const stripe_id = useStoreState(appState, (s) => s.customer?.stripe_id);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const alert = useAlert();
  const history = useHistory();
  const hydratedRoutes = routes({ customer_id, super_user: instanceAuth?.super });
  const [mounted, setMounted] = useState(false);

  const refreshCustomer = () => {
    if (auth && customer_id) {
      getCustomer({ auth, customer_id });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshCustomer, []);

  const refreshUser = async () => {
    if (url) {
      const result = await userInfo({ auth: instanceAuth, url, is_local, compute_stack_id, customer_id });
      if (result.error) {
        alert.error('Unable to connect to instance.');
        history.push(`/o/${customer_id}/instances`);
      } else {
        setInstanceAuths({ ...instanceAuths, [compute_stack_id]: { ...instanceAuth, super: result.role?.permission?.super_user } });
      }
    }
  };

  useInterval(refreshUser, config.refresh_content_interval);

  const refreshSubscriptions = () => {
    if (auth && customer_id && stripe_id) {
      getPrepaidSubscriptions({ auth, customer_id, stripe_id });
    }
  };

  useEffect(refreshSubscriptions, [auth, customer_id, stripe_id]);

  const refreshInstances = () => {
    if (auth && products && regions && subscriptions && customer_id) {
      getInstances({ auth, customer_id, products, regions, subscriptions, instanceCount: instances?.length });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshInstances, [auth, products, regions, customer_id, subscriptions]);

  const refreshInstance = async () => {
    if (instances && instanceAuth) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compute_stack_id, instances]);

  useEffect(() => {
    if (mounted && url && instanceAuth?.super) {
      alert.success('Your instance user role has been upgraded to super_user');
    } else if (mounted && url) {
      alert.success('Your instance user role has been downgraded to standard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceAuth?.super]);

  useAsyncEffect(
    () => setMounted(true),
    () => setMounted(false),
    []
  );

  return (
    <>
      <SubNav routes={hydratedRoutes} />
      {isOrgUser && instances && !loadingInstance ? (
        <Suspense fallback={<Loader header=" " spinner />}>
          <Switch>
            {hydratedRoutes.map((route) => (
              <Route key={route.path} path={route.path} component={route.component} />
            ))}
            <Redirect to={`/o/${customer_id}/i/${compute_stack_id}/${hydratedRoutes[0].link}`} />
          </Switch>
        </Suspense>
      ) : (
        <Loader header="loading instance" spinner />
      )}
    </>
  );
};

export default InstanceIndex;
