import React, { Suspense } from 'react';
import { Redirect, Route, Routes } from 'react-router-dom';

import routes from './routes';
import SubNav from '../shared/SubNav';
import Loader from '../shared/Loader';

function ResourcesIndex() {
  return <>
    <SubNav routes={routes} />
    <Suspense fallback={<Loader header=" " spinner />}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component} />
        ))}
        <Redirect to="/resources/installation" />
      </Routes>
    </Suspense>
  </>
}

export default ResourcesIndex;
