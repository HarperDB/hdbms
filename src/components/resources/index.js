import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import routes from './routes';
import SubNav from '../shared/SubNav';
import Loader from '../shared/Loader';

function ResourcesIndex() {
  return <>
    <SubNav routes={routes} />
    <Suspense fallback={<Loader header=" " spinner />}>
      <Routes>
        {
          routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))
        }
        <Route path="marketplace/active" element={ <Navigate to="../sdks/active" replace /> } />
        <Route path="*" element={ <Navigate to="installation" replace /> } />
      </Routes>
    </Suspense>
  </>
}

export default ResourcesIndex;
