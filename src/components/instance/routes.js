import Browse from './browse';
import Query from './query';
import Clustering from './clustering';
import Config from './config';
import Metrics from './metrics';
import Users from './users';
import Roles from './roles';
import Examples from './examples';

export default ({ super_user }) => {
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
  ];

  const superUserRoutes = [
    {
      component: Clustering,
      path: `/o/:customer_id/i/:compute_stack_id/clustering`,
      link: 'clustering',
      label: 'clustering',
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
      component: Metrics,
      path: `/o/:customer_id/i/:compute_stack_id/metrics`,
      link: 'metrics',
      label: 'metrics',
      icon: 'tachometer',
      iconCode: 'f0e4',
    },
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
