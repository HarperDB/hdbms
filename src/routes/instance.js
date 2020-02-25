import Browse from '../components/instance/browse';
import Clustering from '../components/instance/clustering';
import Config from '../components/instance/config';
import Users from '../components/instance/users';
import Roles from '../components/instance/roles';

export default [
  { component: Browse, path: '/instances/:instance_id/browse/:schema?/:table?/:action?/:hash?', link: 'browse' },
  { component: Clustering, path: '/instances/:instance_id/clustering/:schema?/:table?', link: 'clustering' },
  { component: Config, path: '/instances/:instance_id/config', link: 'config' },
  { component: Users, path: '/instances/:instance_id/users', link: 'users' },
  { component: Roles, path: '/instances/:instance_id/roles', link: 'roles' },
];
