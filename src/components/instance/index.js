import React, { useEffect } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import SubNav from '../navs/subnav';
import routes from './routes';
import useInstanceAuth from '../../state/stores/instanceAuths';
import buildActiveInstanceObject from '../../util/buildActiveInstanceObject';
import appState from '../../state/stores/appState';
import instanceState from '../../state/stores/instanceState';

export default () => {
  const { compute_stack_id } = useParams();
  const [instanceAuths] = useInstanceAuth({});
  const { products, instances, licenses } = useStoreState(appState, (s) => ({
    products: s.products,
    instances: s.instances,
    licenses: s.licenses,
  }));

  useEffect(() => {
    const cancelSub = instanceState.subscribe((s) => s.lastUpdate, (u) => {
      if (instanceAuths && compute_stack_id && instanceAuths[compute_stack_id]) {
        buildActiveInstanceObject({ instanceAuths, compute_stack_id, instances, licenses, products });
      }
    });
    return () => cancelSub();
  }, []);

  useEffect(() => instanceState.update((s) => { s.lastUpdate = Date.now(); }), [compute_stack_id]);

  return (
    <>
      <SubNav routes={routes} instanceId={compute_stack_id} />
      <Switch>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component} />
        ))}
      </Switch>
    </>
  );
};
