import Browse from './browse';
import Clustering from './clustering';
import Config from './config';
import Users from './users';
import Roles from './roles';

export default [
  { component: Browse, path: '/instance/:instance_id/browse/:schema?/:table?/:action?/:hash?', link: 'browse', icon: 'list' },
  { component: Clustering, path: '/instance/:instance_id/clustering/:schema?/:table?', link: 'clustering', icon: 'share-alt' },
  { component: Config, path: '/instance/:instance_id/config', link: 'config', icon: 'wrench' },
  { component: Users, path: '/instance/:instance_id/users', link: 'users', icon: 'users' },
  { component: Roles, path: '/instance/:instance_id/roles', link: 'roles', icon: 'check-square' },
];
