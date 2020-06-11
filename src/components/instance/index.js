import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';

import appState from '../../state/appState';
import instanceState from '../../state/instanceState';
import useInstanceAuth from '../../state/instanceAuths';

import SubNav from './subnav';
import routes from './routes';
import buildActiveInstanceObject from '../../methods/instance/buildActiveInstanceObject';
import Loader from '../shared/loader';
import getInstances from '../../api/lms/getInstances';

export default () => {
  const { compute_stack_id, customer_id } = useParams();
  const [loadingInstance, setLoadingInstance] = useState(false);
  const [instanceAuths] = useInstanceAuth({});
  const instanceAuth = instanceAuths && instanceAuths[compute_stack_id];
  const auth = useStoreState(appState, (s) => s.auth);
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id));
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const instances = useStoreState(appState, (s) => s.instances);
  const alert = useAlert();
  const history = useHistory();
  const hydratedRoutes = routes({ customer_id, super_user: instanceAuth?.super });

  const refreshInstances = useCallback(() => {
    if (auth && products && regions && customer_id) {
      getInstances({ auth, customer_id, products, regions, instanceCount: instances?.length });
    }
  }, [auth, products, regions, customer_id]);

  useEffect(() => refreshInstances(), []);

  const refreshInstance = async () => {
    if (!instanceAuth) {
      alert.error('Unable to log into that instance');
      setLoadingInstance(false);
      setTimeout(() => history.push(`/${customer_id}/instances`), 10);
    } else if (instances) {
      const { error } = await buildActiveInstanceObject({ auth: instanceAuth, compute_stack_id, instances });
      setLoadingInstance(false);
      if (error) {
        alert.error(error);
        setTimeout(() => history.push(`/${customer_id}/instances`), 10);
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

  return isOrgUser ? (
    <>
      <SubNav routes={hydratedRoutes} />
      {!instances || loadingInstance ? (
        <Loader message="loading instance" />
      ) : (
        <Switch>
          {hydratedRoutes.map((route) => (
            <Route key={route.path} path={route.path} component={route.component} />
          ))}
        </Switch>
      )}
    </>
  ) : (
    <Redirect to="/organizations" />
  );
};
