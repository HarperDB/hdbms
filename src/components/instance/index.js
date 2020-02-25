import React, { useState } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import SubNav from './subnav';
import routes from '../../routes/instance';
import useLMS from '../../stores/lmsData';
import useInstanceAuth from '../../stores/instanceAuths';
import buildActiveInstanceObject from '../../util/instance/buildActiveInstanceObject';

export default () => {
  const { instance_id } = useParams();
  const [lmsData] = useLMS({ auth: false, instances: [] });
  const [instanceAuths] = useInstanceAuth({});
  const [activeInstance, setActiveInstance] = useState({ auth: false, structure: false, network: false });
  const [lastUpdate, refreshInstance] = useState({ auth: false, structure: false, network: false });

  useAsyncEffect(async () => {
    if (instance_id) {
      const activeInstanceObject = await buildActiveInstanceObject({ instance_id, instanceAuths, lmsData });
      if (!activeInstanceObject.error) {
        setActiveInstance(activeInstanceObject);
      }
    }
  }, [instance_id, lastUpdate]);

  return (
    <>
      <SubNav routes={routes} instanceId={instance_id} />
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
