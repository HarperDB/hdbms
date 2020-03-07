import React, { useState } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import SubNav from '../navs/subnav';
import routes from './routes';
import useInstanceAuth from '../../state/stores/instanceAuths';
import buildActiveInstanceObject from '../../util/buildActiveInstanceObject';
import defaultActiveInstance from '../../state/defaults/defaultActiveInstance';
import useApp from '../../state/stores/appData';
import defaultAppData from '../../state/defaults/defaultAppData';


export default () => {
  const { compute_stack_id } = useParams();
  const [appData] = useApp(defaultAppData);
  const [instanceAuths] = useInstanceAuth({});
  const [activeInstance, setActiveInstance] = useState(defaultActiveInstance);
  const [lastUpdate, refreshInstance] = useState(false);

  useAsyncEffect(async () => {
    if (compute_stack_id) {
      const activeInstanceObject = await buildActiveInstanceObject({ compute_stack_id, instanceAuths, appData });
      if (!activeInstanceObject.error) {
        setActiveInstance(activeInstanceObject);
      }
    }
  }, [compute_stack_id, lastUpdate]);

  return (
    <>
      <SubNav routes={routes} instanceId={compute_stack_id} />
      <Switch>
        {routes.map((route) => {
          const ThisRouteComponent = route.component;
          return (
            <Route key={route.path} path={route.path} render={() => <ThisRouteComponent {...activeInstance} refreshInstance={refreshInstance} />} />
          );
        })}
      </Switch>
    </>
  );
};
