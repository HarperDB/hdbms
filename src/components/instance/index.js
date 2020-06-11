import React, { useState, useEffect } from 'react';
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

export default () => {
  const { compute_stack_id, customer_id } = useParams();
  const [loadingInstance, setLoadingInstance] = useState(false);
  const [instanceAuths] = useInstanceAuth({});
  const auth = instanceAuths && instanceAuths[compute_stack_id];
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id));
  const instances = useStoreState(appState, (s) => s.instances);
  const alert = useAlert();
  const history = useHistory();
  const hydratedRoutes = routes({ customer_id, super_user: auth?.super });

  const refreshInstance = async () => {
    if (!auth) {
      alert.error('Unable to log into that instance');
      setLoadingInstance(false);
      setTimeout(() => history.push(`/${customer_id}/instances`), 10);
    } else if (instances) {
      const { error } = await buildActiveInstanceObject({ auth, compute_stack_id, instances });
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
