import Resources from './resources';
import Installation from './installation';
import Drivers from './drivers';
import Tutorials from './tutorials';

export default [
  {
    component: Installation,
    path: '/support/installation',
    link: 'installation',
    icon: 'wrench',
    iconCode: 'f0ad',
  },
  {
    component: Tutorials,
    path: '/support/tutorials',
    link: 'tutorials',
    icon: 'video-camera',
    iconCode: 'f03d',
  },
  {
    component: Drivers,
    path: '/support/drivers',
    link: 'drivers',
    icon: 'cubes',
    iconCode: 'f1b3',
  },
  {
    component: Resources,
    path: '/support/resources',
    link: 'resources',
    icon: 'external-link-square',
    iconCode: 'f14c',
  },
];
