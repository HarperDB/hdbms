import Browse from '../pages/browse';
import Clustering from '../pages/clustering';
import Configuration from '../pages/configuration';
import Enterprise from '../pages/enterprise';
import Login from '../pages/login';

export default [
  { component: Browse, link: '/browse', path: '/browse/:schema?/:table?/:action?/:hash?', label: 'Browse' },
  { component: Clustering, path: '/clustering', label: 'Clustering' },
  { component: Configuration, path: '/configuration', label: 'Configuration' },
  { component: Enterprise, path: '/enterprise', label: 'Enterprise' },
  { component: Login, path: '/' },
];
