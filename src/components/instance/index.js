import React, { useState, Suspense, useEffect } from 'react';
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
import buildInstanceStructure from '../../functions/instance/buildInstanceStructure';
import Loader from '../shared/loader';
import getInstances from '../../functions/api/lms/getInstances';
import getCustomer from '../../functions/api/lms/getCustomer';
import getAlarms from '../../functions/api/lms/getAlarms';
import config from '../../config';
import userInfo from '../../functions/api/instance/userInfo';

const InstanceIndex = () => {
  const { compute_stack_id, customer_id } = useParams();
  const [loadingInstance, setLoadingInstance] = useState(true);
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = instanceAuths && instanceAuths[compute_stack_id];
  const auth = useStoreState(appState, (s) => s.auth);
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id));
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const subscriptions = useStoreState(appState, (s) => s.subscriptions);
  const instances = useStoreState(appState, (s) => s.instances);
  const thisInstance = useStoreState(appState, (s) => compute_stack_id && s.instances && s.instances.find((i) => i.compute_stack_id === compute_stack_id), [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const alert = useAlert();
  const history = useHistory();
  const hydratedRoutes = routes({ customer_id, super_user: instanceAuth?.super });
  const [mounted, setMounted] = useState(false);

  useAsyncEffect(() => {
    if (auth && customer_id) {
      getCustomer({ auth, customer_id });
    }
  }, [auth, customer_id]);

  useEffect(() => {
    if (auth && customer_id && instances?.length) {
      getAlarms({ auth, customer_id, instances });
    }
  }, [auth, customer_id, instances]);

  useAsyncEffect(() => {
    if (auth && products && regions && subscriptions && customer_id && !instances?.length) {
      getInstances({ auth, customer_id, products, regions, subscriptions, instanceCount: instances?.length });
    }
  }, [auth, products, regions, customer_id, subscriptions, instances]);

  useAsyncEffect(async () => {
    if (thisInstance && instanceAuth) {
      instanceState.update(() => Object.entries(thisInstance).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {}));
      const { error } = await buildInstanceStructure({ auth: instanceAuth, url: thisInstance.url });
      setLoadingInstance(false);
      if (error) {
        setTimeout(() => history.push(`/o/${customer_id}/instances`), 10);
      }
    }
  }, [compute_stack_id, thisInstance]);

  useAsyncEffect(() => {
    if (mounted && url && instanceAuth?.super) {
      alert.success('Your instance user role has been upgraded to super_user');
    } else if (mounted && url) {
      alert.success('Your instance user role has been downgraded to standard');
    }
  }, [alert, instanceAuth?.super]);

  useAsyncEffect(
    () => setMounted(true),
    () => setMounted(false),
    []
  );

  useInterval(async () => {
    if (url) {
      const result = await userInfo({ auth: instanceAuth, url, is_local, compute_stack_id, customer_id });
      if (result.error) {
        alert.error('Unable to connect to instance.');
        history.push(`/o/${customer_id}/instances`);
      } else {
        setInstanceAuths({ ...instanceAuths, [compute_stack_id]: { ...instanceAuth, super: result.role?.permission?.super_user } });
      }
    }
  }, config.refresh_content_interval);

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
