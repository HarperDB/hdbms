import { lazy, React } from 'react';

import Browse from './browse';
import config from '../../config';

const Charts = lazy(() => import(/* webpackChunkName: "instance-charts" */ './charts'));
const Query = lazy(() => import(/* webpackChunkName: "instance-query" */ './query'));
const Cluster = lazy(() => import(/* webpackChunkName: "instance-cluster" */ './replication'));
const Config = lazy(() => import(/* webpackChunkName: "instance-config" */ './config'));
const Metrics = lazy(() => import(/* webpackChunkName: "instance-status" */ './status'));
const Users = lazy(() => import(/* webpackChunkName: "instance-users" */ './users'));
const Roles = lazy(() => import(/* webpackChunkName: "instance-roles" */ './roles'));
const Functions = lazy(() => import(/* webpackChunkName: "custom-functions" */ './functions'));

const routes = ({ super_user, version = null }) => {
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

  let supportsApplications = false;

  if (version) {
    const [a, b] = version?.split('.') || [];

    const major = parseInt(a, 10);
    const minor = parseInt(b, 10);
    const versionAsFloat = parseFloat(`${major}.${minor}`);

    supportsApplications = versionAsFloat >= 4.2;
  }

  if (config.is_local_studio && super_user) {
    return [browse, query, users, roles, cluster, supportsApplications ? applications : functions, metrics, configure];
  }

  if (super_user) {
    return [browse, query, users, roles, charts, cluster, supportsApplications ? applications : functions, metrics, configure];
  }

  if (config.is_local_studio) {
    return [browse, query, charts];
  }

  return [browse, query];
};
export default routes;
