import React, { useState } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import SubNav from '../navs/subnav';
import routes from './routes';
import useLMS from '../../state/stores/lmsAuth';
import useInstanceAuth from '../../state/stores/instanceAuths';
import buildActiveInstanceObject from '../../util/buildActiveInstanceObject';
import defaultLMSAuth from '../../state/defaults/defaultLMSAuth';
import defaultActiveInstance from '../../state/defaults/defaultActiveInstance';
import getInstances from '../../api/lms/getInstances';
import getLicenses from '../../api/lms/getLicenses';
import useApp from '../../state/stores/appData';
import defaultAppData from '../../state/defaults/defaultAppData';
import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';
import getCustomer from '../../api/lms/getCustomer';

export default () => {
  const { instance_id } = useParams();
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [appData, setAppData] = useApp(defaultAppData);
  const [instanceAuths] = useInstanceAuth({});
  const [activeInstance, setActiveInstance] = useState(defaultActiveInstance);
  const [lastUpdate, refreshInstance] = useState(false);

  useAsyncEffect(async () => {
    if (instance_id) {
      const products = await getProducts();
      const regions = await getRegions();
      const customer = await getCustomer({ auth: lmsAuth });
      const licenses = await getLicenses({ auth: lmsAuth });
      const instances = await getInstances({ auth: lmsAuth, products, regions, licenses });
      const newAppData = { ...appData, customer, products, regions, instances, licenses };
      setAppData(newAppData);
      const activeInstanceObject = await buildActiveInstanceObject({ instance_id, instanceAuths, appData: newAppData });
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
