import Browse from '../pages/instance/browse';
import Fabric from '../pages/fabric';
// import Configuration from '../pages/instance/configuration';
// import License from '../pages/instance/license';

export default [
  { component: Browse, link: '/browse', path: '/browse/:schema?/:table?/:action?/:hash?', label: 'Browse' },
  { component: Fabric, path: '/fabric' },
  // { component: Configuration, path: '/configuration', label: 'Configuration' },
  // { component: License, path: '/license', label: 'License' },
];
