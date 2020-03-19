import React, { useEffect } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../state/stores/appState';
import instanceState from '../../state/stores/instanceState';
import useInstanceAuth from '../../state/stores/instanceAuths';

import SubNav from './subnav';
import routes from './routes';
import buildActiveInstanceObject from '../../util/instance/buildActiveInstanceObject';

export default () => {
  const { compute_stack_id } = useParams();
  const [instanceAuths] = useInstanceAuth({});
  const instance_name = useStoreState(instanceState, (s) => s.instance_name);
  const { instances, products, regions, licenses } = useStoreState(appState, (s) => ({
    products: s.products,
    regions: s.regions,
    licenses: s.licenses,
    instances: s.instances,
  }));

  useEffect(() => {
    const cancelSub = instanceState.subscribe((s) => s.lastUpdate, () => {
      if (instanceAuths && compute_stack_id && instanceAuths[compute_stack_id] && products && regions && licenses) {
        const auth = instanceAuths[compute_stack_id];
        const thisInstance = instances.find((i) => i.compute_stack_id === compute_stack_id);
        const license = licenses.find((l) => l.compute_stack_id === compute_stack_id);
        const compute = products[thisInstance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === thisInstance.stripe_plan_id);
        const storage = thisInstance.is_local ? null : products.cloudStorage.find((p) => p.value === thisInstance.data_volume_size);
        const computeProducts = thisInstance.is_local ? products.localCompute : products.cloudCompute;
        const storageProducts = thisInstance.is_local ? false : products.cloudStorage;

        buildActiveInstanceObject({ thisInstance, auth, license, compute, storage, computeProducts, storageProducts });
      }
    });
    return () => cancelSub();
  }, []);

  useEffect(() => instanceState.update((s) => { s.lastUpdate = Date.now(); }), [compute_stack_id]);

  return (
    <>
      <SubNav routes={routes} instanceName={instance_name} instanceId={compute_stack_id} />
      <Switch>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component} />
        ))}
      </Switch>
    </>
  );
};
