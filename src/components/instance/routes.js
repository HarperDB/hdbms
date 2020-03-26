import Browse from './browse';
import Clustering from './clustering';
import Config from './config';
import Users from './users';
import Roles from './roles';

export default [
  { component: Browse, path: '/instance/:compute_stack_id/browse/:schema?/:table?/:action?/:hash?', link: 'browse', icon: 'list' },
  { component: Clustering, path: '/instance/:compute_stack_id/clustering/:schema?/:table?', link: 'clustering', icon: 'share-alt' },
  { component: Users, path: '/instance/:compute_stack_id/users', link: 'users', icon: 'users' },
  { component: Roles, path: '/instance/:compute_stack_id/roles/:role_id?', link: 'roles', icon: 'check-square' },
  { component: Config, path: '/instance/:compute_stack_id/config', link: 'config', icon: 'wrench' },
];
