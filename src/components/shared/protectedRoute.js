import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import useLMS from '../../state/stores/lmsAuth';
import defaultLMSAuth from '../../state/defaults/defaultLMSAuth';

import TopNav from '../navs/topnav';

export default ({ component, path }) => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  return lmsAuth.email && lmsAuth.pass ? (
    <>
      <TopNav />
      <Route path={path} component={component} />
    </>
  ) : (
    <Redirect to="/" />
  );
};
