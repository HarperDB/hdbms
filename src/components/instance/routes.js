import { lazy, React } from 'react';

import Browse from './browse';
import config from '../../config';
import supportsApplications from '../../functions/instance/functions/supportsApplications';

const Charts = lazy(() => import(/* webpackChunkName: "instance-charts" */ './charts'));
const Query = lazy(() => import(/* webpackChunkName: "instance-query" */ './query'));
const Cluster = lazy(() => import(/* webpackChunkName: "instance-cluster" */ './replication'));
const Config = lazy(() => import(/* webpackChunkName: "instance-config" */ './config'));
const Metrics = lazy(() => import(/* webpackChunkName: "instance-status" */ './status'));
const Users = lazy(() => import(/* webpackChunkName: "instance-users" */ './users'));
const Roles = lazy(() => import(/* webpackChunkName: "instance-roles" */ './roles'));
const Functions = lazy(() => import(/* webpackChunkName: "custom-functions" */ './functions'));

const routes = ({ super_user, version = null }) => {
  const useApplications = supportsApplications({ version });

  const browse = {
    element: <Browse />,
    path: `browse/:schema?/:table?/:action?/:hash?`,
    link: 'browse',
    label: 'browse',
    icon: 'list',
  };

  const query = {
    element: <Query />,
    path: `query`,
    link: 'query',
    label: 'query',
    icon: 'search',
  };

  const users = {
    element: <Users />,
    path: `users/:username?`,
    link: 'users',
    label: 'users',
    icon: 'users',
  };

  const roles = {
    element: <Roles />,
    path: `roles/:role_id?`,
    link: 'roles',
    label: 'roles',
    icon: 'check-square',
  };

  const charts = {
    element: <Charts />,
    path: `charts`,
    link: 'charts',
    label: 'charts',
    icon: 'chart-line',
  };

  const cluster = {
    element: <Cluster />,
    path: `replication`,
    link: 'replication',
    label: 'replication',
    icon: 'cubes',
  };

  const functions = {
    element: <Functions />,
    path: `functions/:action?/:project?/:type?/:file?`,
    link: 'functions',
    label: 'functions',
    icon: 'project-diagram',
  };

  const applications = {
    element: <Functions />,
    path: 'applications',
    link: 'applications',
    label: 'applications',
    icon: 'project-diagram',
  };

  const metrics = {
    element: <Metrics />,
    path: `status`,
    link: 'status',
    label: 'status',
    icon: 'tachometer-alt',
  };

  const configure = {
    element: <Config />,
    path: `config`,
    link: 'config',
    label: 'config',
    icon: 'wrench',
  };

  if (config.is_local_studio && super_user) {
    return [browse, query, users, roles, cluster, useApplications ? applications : functions, metrics, configure];
  }

  if (super_user) {
    return [browse, query, users, roles, charts, cluster, useApplications ? applications : functions, metrics, configure];
  }

  if (config.is_local_studio) {
    return [browse, query, charts];
  }

  return [browse, query];
};
export default routes;
