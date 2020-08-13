import { lazy } from 'react';

const Resources = lazy(() => import(/* webpackChunkName: "support-resources" */ './resources'));
const Installation = lazy(() => import(/* webpackChunkName: "support-installation" */ './installation'));
const Drivers = lazy(() => import(/* webpackChunkName: "support-drivers" */ './drivers'));
const Marketplace = lazy(() => import(/* webpackChunkName: "support-marketplace" */ './marketplace'));
const Tutorials = lazy(() => import(/* webpackChunkName: "support-tutorials" */ './tutorials'));
const Examples = lazy(() => import(/* webpackChunkName: "support-examples" */ './examples'));

export default [
  {
    component: Installation,
    path: '/support/installation',
    link: '/support/installation',
    label: 'installation',
    icon: 'wrench',
    iconCode: 'f0ad',
  },
  {
    component: Tutorials,
    path: '/support/tutorials',
    link: '/support/tutorials',
    label: 'tutorials',
    icon: 'video-camera',
    iconCode: 'f03d',
  },
  /*
  {
    component: Marketplace,
    path: '/support/marketplace/:id?',
    link: '/support/marketplace',
    label: 'marketplace',
    icon: 'shopping-cart',
    iconCode: 'f07a',
  },
  */
  {
    component: Drivers,
    path: '/support/drivers',
    link: '/support/drivers',
    label: 'drivers',
    icon: 'cubes',
    iconCode: 'f1b3',
  },
  {
    component: Resources,
    path: '/support/resources',
    link: '/support/resources',
    label: 'resources',
    icon: 'external-link-square',
    iconCode: 'f14c',
  },
  {
    component: Examples,
    path: '/support/examples/:folder?/:method?',
    link: '/support/examples',
    label: 'example code',
    icon: 'code',
    iconCode: 'f121',
  },
];
