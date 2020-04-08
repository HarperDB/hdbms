import React, { useState, useEffect } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';

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
  const auth = instanceAuths && instanceAuths[compute_stack_id];
  const instances = useStoreState(appState, (s) => s.instances);
  const alert = useAlert();
  const history = useHistory();

  useEffect(() => {
    const refreshInstance = async () => {
      if (!loadingInstance && auth) {
        const { error } = await buildActiveInstanceObject({
          instances,
          compute_stack_id,
          auth,
        });
        setLoadingInstance(false);
        if (error) {
          alert.error(error);
          history.push('/instances');
        }
      }
    };

    setLoadingInstance(true);
    const cancelSub = instanceState.subscribe(
      (s) => s.lastUpdate,
      () => refreshInstance()
    );
    refreshInstance();
    return () => cancelSub();
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
