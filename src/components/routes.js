import Browse from './browse';
import Clustering from './clustering';
import License from './license';
import Users from './users';
import Roles from './roles';

const routes = [
  { component: Browse, path: '/instances/:instance_id/browse/:schema?/:table?/:action?/:hash?', link: 'browse' },
  { component: Clustering, path: '/instances/:instance_id/clustering/:schema?/:table?', link: 'clustering' },
  { component: License, path: '/instances/:instance_id/license', link: 'license' },
  { component: Users, path: '/instances/:instance_id/users', link: 'users' },
  { component: Roles, path: '/instances/:instance_id/roles', link: 'roles' },
];

export default routes;
