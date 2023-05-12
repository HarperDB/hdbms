import { lazy, React } from 'react';

const Links = lazy(() => import(/* webpackChunkName: "support-links" */ './links'));
const Drivers = lazy(() => import(/* webpackChunkName: "support-drivers" */ './drivers'));
const SDKs = lazy(() => import(/* webpackChunkName: "support-sdks" */ './sdks'));
const Tutorials = lazy(() => import(/* webpackChunkName: "support-tutorials" */ './tutorials'));
const Examples = lazy(() => import(/* webpackChunkName: "support-examples" */ './examples'));
const DBMigrator = lazy(() => import(/* webpackChunkName: "support-dbmigrator" */ './dbmigrator'));

const Routes = [
  {
    element: <Examples />,
    path: 'examples/:folder?/:method?',
    link: 'examples',
    label: 'example code',
    icon: 'code',
    iconCode: 'f121',
  },
  {
    // Installation instructions now links to our docs.
    // Retaining this entry for the navigation.
    element: null,
    path: '.',
    link: 'installation',
    label: 'installation',
    icon: 'wrench',
    iconCode: 'f0ad',
    external: true,
    url: 'https://docs.harperdb.io/docs/install-harperdb'
  },
  {
    element: <Tutorials />,
    path: 'tutorials/:video_id?',
    link: 'tutorials',
    label: 'tutorials',
    icon: 'video-camera',
    iconCode: 'f03d',
  },
  {
    element: <SDKs />,
    path: 'sdks/:type?',
    link: 'sdks/active',
    label: 'sdks',
    icon: 'gears',
    iconCode: 'f085',
  },
  {
    element: <Drivers />,
    path: 'drivers',
    link: 'drivers',
    label: 'drivers',
    icon: 'cubes',
    iconCode: 'f1b3',
  },
  /*
  {
    element: <DBMigrator />,
    path: 'dbmigrator',
    link: 'dbmigrator',
    label: 'dbmigrator',
    icon: 'coins',
    iconCode: 'f51e',
  },
  */
  {
    element: <Links />,
    path: 'links',
    link: 'links',
    label: 'links',
    icon: 'external-link-square',
    iconCode: 'f14c',
  },
];

export default Routes;
