import Browse from '../pages/instance/browse';
// import Clustering from '../pages/instance/clustering';
// import Configuration from '../pages/instance/configuration';
// import Enterprise from '../pages/instance/enterprise';

export default [
  { component: Browse, link: '/browse', path: '/browse/:schema?/:table?/:action?/:hash?' }, // , label: 'Browse'
  // { component: Clustering, path: '/clustering', label: 'Clustering' },
  // { component: Configuration, path: '/configuration', label: 'Configuration' },
  // { component: Enterprise, path: '/enterprise', label: 'Enterprise' },
];
