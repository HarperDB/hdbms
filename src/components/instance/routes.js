import Browse from './browse';
import Query from './query';
import Clustering from './clustering';
import Config from './config';
import Metrics from './metrics';
import Users from './users';
import Roles from './roles';

export default ({ super_user }) => {
  const standardRoutes = [
    {
      component: Browse,
      path: `/o/:customer_id/i/:compute_stack_id/browse/:schema?/:table?/:action?/:hash?`,
      link: 'browse',
      icon: 'list',
      iconCode: 'f03a',
    },
    {
      component: Query,
      path: `/o/:customer_id/i/:compute_stack_id/query`,
      link: 'query',
      icon: 'search',
      iconCode: 'f121',
    },
  ];

  const superUserRoutes = [
    {
      component: Clustering,
      path: `/o/:customer_id/i/:compute_stack_id/clustering`,
      link: 'clustering',
      icon: 'cubes',
      iconCode: 'f1e0',
    },
    {
      component: Users,
      path: `/o/:customer_id/i/:compute_stack_id/users/:username?`,
      link: 'users',
      icon: 'users',
      iconCode: 'f0c0',
    },
    {
      component: Roles,
      path: `/o/:customer_id/i/:compute_stack_id/roles/:role_id?`,
      link: 'roles',
      icon: 'check-square',
      iconCode: 'f14a',
    },
    {
      component: Config,
      path: `/o/:customer_id/i/:compute_stack_id/config`,
      link: 'config',
      icon: 'wrench',
      iconCode: 'f0ad',
    },
    {
      component: Metrics,
      path: `/o/:customer_id/i/:compute_stack_id/metrics`,
      link: 'metrics',
      icon: 'tachometer',
      iconCode: 'f0e4',
    },
  ];

  return super_user ? [...standardRoutes, ...superUserRoutes] : standardRoutes;
};
