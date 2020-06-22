import Resources from './resources';
import Installation from './installation';
import Drivers from './drivers';
import Tutorials from './tutorials';
import Examples from './examples';

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
