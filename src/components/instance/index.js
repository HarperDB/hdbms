import React, { lazy, useState, Suspense } from 'react';
import { Navigate, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';

import appState from '../../functions/state/appState';
import instanceState from '../../functions/state/instanceState';
import useInstanceAuth from '../../functions/state/instanceAuths';

import SubNav from './Subnav';
import routes from './routes';
import buildInstanceStructure from '../../functions/instance/browse/buildInstanceStructure';
import Loader from '../shared/Loader';
import getInstances from '../../functions/api/lms/getInstances';
import getCustomer from '../../functions/api/lms/getCustomer';
import getAlarms from '../../functions/api/lms/getAlarms';
import config from '../../config';
import userInfo from '../../functions/api/instance/userInfo';
import registrationInfo from '../../functions/api/instance/registrationInfo';

import Browse, { metadata as browseRouterData } from './browse';
import { metadata as chartsRouterData } from  './charts'; 
import { metadata as queryRouterData } from './query';
import { metadata as clusterRouterData } from './cluster';
import { metadata as configRouterData } from './config';
import { metadata as metricsRouterData } from './status';
import { metadata as usersRouterData }  from './users';
import { metadata as rolesRouterData }  from './roles';
import { metadata as functionsRouterData }  from './functions';
import { metadata as examplesRouterData } from './examples';

const Charts = lazy(() => import(/* webpackChunkName: "instance-charts" */ './charts'));
const Query = lazy(() => import(/* webpackChunkName: "instance-charts" */ './query'));
const Cluster = lazy(() => import(/* webpackChunkName: "instance-charts" */ './cluster'));
const Config = lazy(() => import(/* webpackChunkName: "instance-charts" */ './config'));
const Metrics = lazy(() => import(/* webpackChunkName: "instance-charts" */ './status'));
const Users = lazy(() => import(/* webpackChunkName: "instance-charts" */ './users'));
const Roles = lazy(() => import(/* webpackChunkName: "instance-charts" */ './roles'));
const Functions = lazy(() => import(/* webpackChunkName: "instance-charts" */ './functions'));
const Examples = lazy(() => import(/* webpackChunkName: "instance-charts" */ './examples'));

function InstanceIndex() {
  const { compute_stack_id, customer_id } = useParams();
  const alert = useAlert();
  const navigate = useNavigate();
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
  const restarting = useStoreState(instanceState, (s) => s.restarting);
  const hydratedRoutes = routes({ customer_id, super_user: instanceAuth?.super });
  const [mounted, setMounted] = useState(false);

  useAsyncEffect(() => {
    if (auth && customer_id) {
      getCustomer({ auth, customer_id });
    }
  }, [auth, customer_id]);

  useAsyncEffect(() => {
    if (auth && customer_id) {
      getAlarms({ auth, customer_id });
    }
  }, [auth, customer_id, instances]);

  useAsyncEffect(() => {
    if (auth && products && regions && subscriptions && customer_id && !instances?.length) {
      getInstances({ auth, customer_id, products, regions, subscriptions, instanceCount: instances?.length });
    }
  }, [auth, products, regions, customer_id, subscriptions, instances]);

  useAsyncEffect(async () => {
    if (thisInstance && instanceAuth) {
      instanceState.update(() => thisInstance);
      const { error } = await buildInstanceStructure({ auth: instanceAuth, url: thisInstance.url });
      await registrationInfo({ auth: instanceAuth, url: thisInstance.url });
      setLoadingInstance(false);
      if (error) {
        setTimeout(() => navigate(`/o/${customer_id}/instances`), 10);
      }
    }
  }, [thisInstance]);

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
      const result = await userInfo({ auth: instanceAuth, url });
      if (result.error && result.message !== 'Network request failed' && !restarting) {
        alert.error('Unable to connect to instance.');
        navigate(`/o/${customer_id}/instances`);
      } else if (!result.error && restarting) {
        instanceState.update((s) => {
          s.restarting = false;
        });
      } else if (!result.error && instanceAuth?.super !== result.role?.permission?.super_user) {
        setInstanceAuths({ ...instanceAuths, [compute_stack_id]: { ...instanceAuth, super: result.role?.permission?.super_user } });
      }
    }
  }, config.refresh_content_interval);

  const f = () => ( <Browse />);

  return (
    <>
      <SubNav routes={hydratedRoutes} />
      {isOrgUser && instances && !loadingInstance ? (
        <Suspense fallback={<Loader header=" " spinner />}>
          <Routes>
            <Route
              path={browseRouterData.path}
              key={browseRouterData.path}
              element={f()} />
            <Route
              path={queryRouterData.path}
              key={queryRouterData.path}
              element={ <Query /> } />
            <Route
              path={usersRouterData.path}
              key={usersRouterData.path}
              element={ <Users /> } />
            <Route
              key={rolesRouterData.path}
              path={rolesRouterData.path}
              element={ <Roles /> } />
            <Route
              path={chartsRouterData.path}
              key={chartsRouterData.path}
              element={ <Charts /> } />
            <Route
              path={clusterRouterData.path}
              key={clusterRouterData.path}
              element={ <Cluster /> } />
            <Route
              path={functionsRouterData.path}
              key={functionsRouterData.path}
              element={ <Functions /> } />
            <Route
              path={metricsRouterData.path}
              key={metricsRouterData.path}
              element={ <Metrics /> } />
            <Route
              path={configRouterData.path}
              key={configRouterData.path}
              element={ <Config /> } />
            <Route
              path={examplesRouterData.path}
              key={examplesRouterData.path}
              element={ <Examples /> } />
            <Route path="*" element={
              <Navigate to={browseRouterData.path} replace />
            } />
          </Routes>
        </Suspense>
      ) : (
        <Loader header="loading instance" spinner />
      )}
    </>
  );
}

export default InstanceIndex;
