import React, { useState, useEffect } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../state/stores/appState';
import instanceState from '../../state/stores/instanceState';
import useInstanceAuth from '../../state/stores/instanceAuths';

import SubNav from './subnav';
import routes from './routes';
import buildActiveInstanceObject from '../../util/instance/buildActiveInstanceObject';
import Loader from '../shared/loader';

export default () => {
  const { compute_stack_id } = useParams();
  const [loadingInstance, setLoadingInstance] = useState(false);
  const [instanceAuths] = useInstanceAuth({});
  const instanceAuth = instanceAuths && instanceAuths[compute_stack_id];
  const instances = useStoreState(appState, (s) => s.instances);

  const refreshInstance = async () => {
    if (!loadingInstance && instanceAuth) {
      await buildActiveInstanceObject({
        thisInstance: instances.find((i) => i.compute_stack_id === compute_stack_id),
        auth: instanceAuth,
      });
      setLoadingInstance(false);
    }
  };

  useEffect(() => {
    const cancelSub = instanceState.subscribe(
      (s) => s.lastUpdate,
      () => refreshInstance()
    );
    return () => cancelSub();
  }, []);

  useEffect(() => {
    setLoadingInstance(true);
    refreshInstance();
  }, [compute_stack_id]);

  return (
    <>
      <SubNav routes={routes} />
      {loadingInstance ? (
        <Loader message="loading instance" />
      ) : (
        <Switch>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} component={route.component} />
          ))}
        </Switch>
      )}
    </>
  );
};
