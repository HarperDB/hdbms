import React, { useState, useEffect } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
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
  const [loadingInstance, setLoadingInstance] = useState(true);
  const [instanceAuths] = useInstanceAuth({});
  const auth = instanceAuths && instanceAuths[compute_stack_id];
  const instances = useStoreState(appState, (s) => s.instances);
  const alert = useAlert();
  const history = useHistory();
  const hydratedRoutes = routes({ customer_id });

  useEffect(() => {
    const refreshInstance = async () => {
      if (!auth) {
        alert.error('Unable to log into that instance');
        history.push(`/${customer_id}/instances`);
        setLoadingInstance(false);
      } else if (instances) {
        const { error } = await buildActiveInstanceObject({
          instances,
          compute_stack_id,
          auth,
        });
        setLoadingInstance(false);
        if (error) {
          alert.error(error);
          history.push(`/${customer_id}/instances`);
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
  }, [compute_stack_id, instances]);

  return (
    <>
      <SubNav routes={hydratedRoutes} />
      {loadingInstance ? (
        <Loader message="loading instance" />
      ) : (
        <Switch>
          {hydratedRoutes.map((route) => (
            <Route key={route.path} path={route.path} component={route.component} />
          ))}
        </Switch>
      )}
    </>
  );
};
