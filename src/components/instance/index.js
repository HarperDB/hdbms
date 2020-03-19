import React, { useEffect, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Route, Switch, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../state/stores/appState';
import useInstanceAuth from '../../state/stores/instanceAuths';

import SubNav from './subnav';
import routes from './routes';
import buildActiveInstanceObject from '../../util/instance/buildActiveInstanceObject';
import instanceState from '../../state/stores/instanceState';
import Loader from '../shared/loader';

export default () => {
  const { compute_stack_id } = useParams();
  const [instanceReady, setInstanceReady] = useState(false);
  const [instanceAuths] = useInstanceAuth({});

  const { instances, products, regions, licenses } = useStoreState(appState, (s) => ({
    products: s.products,
    regions: s.regions,
    licenses: s.licenses,
    instances: s.instances,
  }));

  useAsyncEffect(async () => {
    const cancelSub = instanceState.subscribe((s) => s.lastUpdate, async () => {
      if (instanceAuths && compute_stack_id && instanceAuths[compute_stack_id] && products && regions && licenses) {
        setInstanceReady(false);
        const auth = instanceAuths[compute_stack_id];
        const thisInstance = instances.find((i) => i.compute_stack_id === compute_stack_id);
        const license = licenses.find((l) => l.compute_stack_id === compute_stack_id);
        const compute = products[thisInstance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === thisInstance.stripe_plan_id);
        const storage = thisInstance.is_local ? null : products.cloudStorage.find((p) => p.value === thisInstance.data_volume_size);
        const computeProducts = thisInstance.is_local ? products.localCompute : products.cloudCompute;
        const storageProducts = thisInstance.is_local ? false : products.cloudStorage;

        const newInstanceState = await buildActiveInstanceObject({ thisInstance, auth, license, compute, storage, computeProducts, storageProducts });
        instanceState.update((s) => { Object.entries(newInstanceState).map(([key, value]) => s[key] = value); });
        setInstanceReady(true);
      }
    });
    return () => cancelSub();
  }, []);

  useEffect(() => instanceState.update((s) => { s.lastUpdate = Date.now(); }), [compute_stack_id]);

  return (
    <>
      <SubNav routes={routes} instanceReady={instanceReady} />
      {instanceReady ? (
        <Switch>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} component={route.component} />
          ))}
        </Switch>
      ) : (
        <Loader message="loading instance" />
      )}
    </>
  );
};
