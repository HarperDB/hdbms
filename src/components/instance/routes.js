import { lazy } from 'react';

import Browse from './browse';

const Charts = lazy(() => import(/* webpackChunkName: "instance-charts" */ './charts'));
const Query = lazy(() => import(/* webpackChunkName: "instance-query" */ './query'));
const Cluster = lazy(() => import(/* webpackChunkName: "instance-cluster" */ './cluster'));
const Config = lazy(() => import(/* webpackChunkName: "instance-config" */ './config'));
const Metrics = lazy(() => import(/* webpackChunkName: "instance-status" */ './status'));
const Users = lazy(() => import(/* webpackChunkName: "instance-users" */ './users'));
const Roles = lazy(() => import(/* webpackChunkName: "instance-roles" */ './roles'));
const Examples = lazy(() => import(/* webpackChunkName: "instance-examples" */ './examples'));

const Routes = ({ super_user }) => {
  const standardRoutes = [
    {
      component: Browse,
      path: `/o/:customer_id/i/:compute_stack_id/browse/:schema?/:table?/:action?/:hash?`,
      link: 'browse',
      label: 'browse',
      icon: 'list',
      iconCode: 'f03a',
    },
    {
      component: Query,
      path: `/o/:customer_id/i/:compute_stack_id/query`,
      link: 'query',
      label: 'query',
      icon: 'search',
      iconCode: 'f002',
    },
    {
      component: Charts,
      path: `/o/:customer_id/i/:compute_stack_id/charts`,
      link: 'charts',
      label: 'charts',
      icon: 'chart-line',
      iconCode: 'f201',
    },
  ];

  const superUserRoutes = [
    {
      component: Cluster,
      path: `/o/:customer_id/i/:compute_stack_id/cluster`,
      link: 'cluster',
      label: 'cluster',
      icon: 'cubes',
      iconCode: 'f1e0',
    },
    {
      component: Users,
      path: `/o/:customer_id/i/:compute_stack_id/users/:username?`,
      link: 'users',
      label: 'users',
      icon: 'users',
      iconCode: 'f0c0',
    },
    {
      component: Roles,
      path: `/o/:customer_id/i/:compute_stack_id/roles/:role_id?`,
      link: 'roles',
      label: 'roles',
      icon: 'check-square',
      iconCode: 'f14a',
    },
    {
      component: Metrics,
      path: `/o/:customer_id/i/:compute_stack_id/status`,
      link: 'status',
      label: 'status',
      icon: 'tachometer',
      iconCode: 'f0e4',
    },
    {
      component: Config,
      path: `/o/:customer_id/i/:compute_stack_id/config`,
      link: 'config',
      label: 'config',
      icon: 'wrench',
      iconCode: 'f0ad',
    },
  ];

  const trailingRoutes = [
    {
      component: Examples,
      path: `/o/:customer_id/i/:compute_stack_id/examples/:folder?/:method?`,
      link: 'examples',
      label: 'example code',
      icon: 'code',
      iconCode: 'f121',
    },
  ];

  return super_user ? [...standardRoutes, ...superUserRoutes, ...trailingRoutes] : [...standardRoutes, ...trailingRoutes];
};

export default Routes;
