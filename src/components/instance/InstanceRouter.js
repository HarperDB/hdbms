import React, { useState, Suspense } from 'react';
import { Navigate, Route, Routes, useParams, useNavigate } from 'react-router-dom';

import Browse from './browse';
import Charts from './charts';
import Query from './query';
import Cluster from './cluster';
import Config from './config';
import Metrics from './status';
import Users from './users';
import Roles from './roles';
import Functions from './functions';
import Examples from './examples';

export default function InstanceRouter() {
  return (
    <Routes>
      <Route
        key='browse/:schema?/:table?/:action?/:hash?'
        path='browse/:schema?/:table?/:action?/:hash?'
        element={ <Browse /> } />
      <Route
        key='query'
        path='query'
        element={ <Query /> } />
      <Route
        key='users/:username?'
        path='users/:username?'
        element={ <Users /> } />
      <Route
        key='roles/:role_id?'
        path='roles/:role_id?'
        element={ <Roles /> } />
      <Route
        key='charts'
        path='charts'
        element={ <Charts /> } />
      <Route
        key='cluster'
        path='cluster'
        element={ <Cluster /> } />
      <Route
        key='functions/:action?/:project?/:type?/:file?'
        path='functions/:action?/:project?/:type?/:file?'
        element={ <Functions /> } />
      <Route
        key='status'
        path='status'
        element={ <Metrics /> } />
      <Route
        key='config'
        path='config'
        element={ <Config /> } />
      <Route
        key='browse/:schema?/:table?/:action?/:hash?'
        path='browse/:schema?/:table?/:action?/:hash?'
        element={ <Examples /> } />
      <Route path="*" element={
        <Navigate to='browse/:schema?/:table?/:action?/:hash?' replace />
      } />
    </Routes>
  )

}
