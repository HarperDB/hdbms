import React, { useState } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import SubNav from '../shared/subnav';
import routes from './routes';
import useLMS from '../../state/lmsData';
import useInstanceAuth from '../../state/instanceAuths';
import buildActiveInstanceObject from '../../util/buildActiveInstanceObject';
import defaultLMSData from '../../state/defaults/defaultLMSData';
import defaultActiveInstance from '../../state/defaults/defaultActiveInstance';
import getInstances from '../../api/lms/getInstances';
import getLicenses from '../../api/lms/getLicenses';
import getProducts from '../../api/lms/getProducts';

export default () => {
  const { instance_id } = useParams();
  const [lmsData, setLMSData] = useLMS(defaultLMSData);
  const [instanceAuths] = useInstanceAuth({});
  const [activeInstance, setActiveInstance] = useState(defaultActiveInstance);
  const [lastUpdate, refreshInstance] = useState(false);

  useAsyncEffect(async () => {
    if (instance_id) {
      const instances = await getInstances({ auth: lmsData.auth });
      const licenses = await getLicenses({ auth: lmsData.auth });
      const products = await getProducts({ auth: lmsData.auth });
      setLMSData({ ...lmsData, instances, licenses, products });
      const activeInstanceObject = await buildActiveInstanceObject({ instance_id, instanceAuths, lmsData: { ...lmsData, instances, licenses, products } });
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
