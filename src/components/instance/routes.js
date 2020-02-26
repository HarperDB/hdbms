import Browse from './browse';
import Clustering from './clustering';
import Config from './config';
import Users from './users';
import Roles from './roles';

export default [
  { component: Browse, path: '/instances/:instance_id/browse/:schema?/:table?/:action?/:hash?', link: 'browse', icon: 'list' },
  { component: Clustering, path: '/instances/:instance_id/clustering/:schema?/:table?', link: 'clustering', icon: 'share-alt' },
  { component: Config, path: '/instances/:instance_id/config', link: 'config', icon: 'wrench' },
  { component: Users, path: '/instances/:instance_id/users', link: 'users', icon: 'users' },
  { component: Roles, path: '/instances/:instance_id/roles', link: 'roles', icon: 'check-square' },
];
