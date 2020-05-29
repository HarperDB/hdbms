import Resources from './resources';
import Installation from './installation';
import Drivers from './drivers';
import Tutorials from './tutorials';

export default [
  {
    component: Installation,
    path: '/support/installation',
    label: 'installation',
    icon: 'wrench',
    iconCode: 'f0ad',
  },
  {
    component: Tutorials,
    path: '/support/tutorials',
    label: 'tutorials',
    icon: 'video-camera',
    iconCode: 'f03d',
  },
  {
    component: Drivers,
    path: '/support/drivers',
    label: 'drivers',
    icon: 'cubes',
    iconCode: 'f1b3',
  },
  {
    component: Resources,
    path: '/support/resources',
    label: 'resources',
    icon: 'external-link-square',
    iconCode: 'f14c',
  },
];
