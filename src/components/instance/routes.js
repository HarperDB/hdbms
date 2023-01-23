import { lazy } from 'react';

import Browse from './browse';

const Charts = lazy(() => import(/* webpackChunkName: "instance-charts" */ './charts'));
const Query = lazy(() => import(/* webpackChunkName: "instance-query" */ './query'));
const Cluster = lazy(() => import(/* webpackChunkName: "instance-cluster" */ './cluster'));
const Config = lazy(() => import(/* webpackChunkName: "instance-config" */ './config'));
const Metrics = lazy(() => import(/* webpackChunkName: "instance-status" */ './status'));
const Users = lazy(() => import(/* webpackChunkName: "instance-users" */ './users'));
const Roles = lazy(() => import(/* webpackChunkName: "instance-roles" */ './roles'));
const Functions = lazy(() => import(/* webpackChunkName: "custom-functions" */ './functions'));
const Examples = lazy(() => import(/* webpackChunkName: "instance-examples" */ './examples'));

const browse = {
  component: Browse,
  path: `/o/:customer_id/i/:compute_stack_id/browse/:schema?/:table?/:action?/:hash?`,
  link: 'browse',
  label: 'browse',
  icon: 'list',
  iconCode: 'f03a',
};

const query = {
  component: Query,
  path: `/o/:customer_id/i/:compute_stack_id/query`,
  link: 'query',
  label: 'query',
  icon: 'search',
  iconCode: 'f002',
};

const users = {
  component: Users,
  path: `/o/:customer_id/i/:compute_stack_id/users/:username?`,
  link: 'users',
  label: 'users',
  icon: 'users',
  iconCode: 'f0c0',
};

const roles = {
  component: Roles,
  path: `/o/:customer_id/i/:compute_stack_id/roles/:role_id?`,
  link: 'roles',
  label: 'roles',
  icon: 'check-square',
  iconCode: 'f14a',
};

const charts = {
  component: Charts,
  path: `/o/:customer_id/i/:compute_stack_id/charts`,
  link: 'charts',
  label: 'charts',
  icon: 'chart-line',
  iconCode: 'f201',
};

const cluster = {
  component: Cluster,
  path: `/o/:customer_id/i/:compute_stack_id/cluster`,
  link: 'cluster',
  label: 'cluster',
  icon: 'cubes',
  iconCode: 'f1e0',
};

const functions = {
  component: Functions,
  path: `functions/:action?/:project?/:type?/:file?`,
  link: 'functions',
  label: 'functions',
  icon: 'project-diagram',
  iconCode: 'f542',
};

const metrics = {
  component: Metrics,
  path: `status`,
  link: 'status',
  label: 'status',
  icon: 'tachometer',
  iconCode: 'f0e4',
};

const config = {
  component: Config,
  path: `config`,
  link: 'config',
  label: 'config',
  icon: 'wrench',
  iconCode: 'f0ad',
};

const examples = {
  component: Examples,
  path: `examples/:folder?/:method?`,
  link: 'examples',
  label: 'example code',
  icon: 'code',
  iconCode: 'f121',
};

const routes = ({ super_user }) => (super_user ? [browse, query, users, roles, charts, cluster, functions, metrics, config, examples] : [browse, query, charts, examples]);

export default routes;
