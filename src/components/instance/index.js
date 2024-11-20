import React, { useState, Suspense } from 'react';
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
function InstanceIndex() {
  const {
    computeStackId,
    customerId
  } = useParams();
  const alert = useAlert();
  const navigate = useNavigate();
  const [loadingInstance, setLoadingInstance] = useState(true);
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = instanceAuths && instanceAuths[computeStackId];
  const auth = useStoreState(appState, s => s.auth);
  const isOrgUser = useStoreState(appState, s => s.auth?.orgs?.find(o => o.customerId?.toString() === customerId));
  const products = useStoreState(appState, s => s.products);
  const regions = useStoreState(appState, s => s.regions);
  const subscriptions = useStoreState(appState, s => s.subscriptions);
  const instances = useStoreState(appState, s => s.instances);
  const thisInstance = useStoreState(appState, s => computeStackId && s.instances && s.instances.find(i => i.computeStackId === computeStackId), [computeStackId]);
  const url = useStoreState(instanceState, s => s.url);
  const restarting = useStoreState(instanceState, s => s.restarting);
  const registration = useStoreState(instanceState, s => s.registration);
  const hydratedRoutes = routes({
    customerId,
    superUser: instanceAuth?.super,
    version: registration?.version
  });
  const [mounted, setMounted] = useState(false);
  useAsyncEffect(() => {
    if (!config.isLocalStudio && auth && customerId) {
      getCustomer({
        auth,
        customerId
      });
    }
  }, [auth, customerId, config.isLocalStudio]);
  useAsyncEffect(() => {
    if (!config.isLocalStudio && auth && customerId) {
      getAlarms({
        auth,
        customerId
      });
    }
  }, [auth, customerId, instances, config.isLocalStudio]);
  useAsyncEffect(() => {
    if (auth && products && regions && subscriptions && customerId && !instances?.length) {
      getInstances({
        auth,
        customerId,
        products,
        regions,
        subscriptions,
        instanceCount: instances?.length
      });
    }
  }, [auth, products, regions, customerId, subscriptions, instances]);
  useAsyncEffect(async () => {
    if (thisInstance && instanceAuth) {
      instanceState.update(() => thisInstance);
      const {
        error
      } = await buildInstanceStructure({
        auth: instanceAuth,
        url: thisInstance.url
      });
      await registrationInfo({
        auth: instanceAuth,
        url: thisInstance.url
      });
      setLoadingInstance(false);
      if (error) {
        setTimeout(() => navigate(`/o/${customerId}/instances`), 10);
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
  useAsyncEffect(() => setMounted(true), () => setMounted(false), []);
  useInterval(async () => {
    if (url) {
      const result = await userInfo({
        auth: instanceAuth,
        url
      });
      if (result.error && result.message !== 'Network request failed' && !restarting) {
        alert.error('Unable to connect to instance.');
        navigate(`/o/${customerId}/instances`);
      } else if (!result.error && restarting) {
        instanceState.update(s => {
          s.restarting = false;
        });
      } else if (!result.error && instanceAuth?.super !== result.role?.permission?.superUser) {
        setInstanceAuths({
          ...instanceAuths,
          [computeStackId]: {
            ...instanceAuth,
            super: result.role?.permission?.superUser
          }
        });
      }
    }
  }, config.refreshContentInterval);
  return <>
      <SubNav routes={hydratedRoutes} />
      {(config.isLocalStudio || isOrgUser && instances) && !loadingInstance ? <Suspense fallback={<Loader header=" " spinner />}>
          <Routes>
            {hydratedRoutes.map(route => <Route path={route.path} key={route.path} element={route.element} />)}
            <Route path="*" element={<Navigate to={hydratedRoutes[0].path} replace />} />
          </Routes>
        </Suspense> : <Loader header="loading instance" spinner />}
    </>;
}
export default InstanceIndex;