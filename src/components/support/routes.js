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
  },
  {
    component: Tutorials,
    path: '/support/tutorials',
    link: 'tutorials',
    icon: 'video-camera',
  },
  {
    component: Drivers,
    path: '/support/drivers',
    link: 'drivers',
    icon: 'cubes',
  },
  {
    component: Resources,
    path: '/support/resources',
    link: 'resources',
    icon: 'external-link',
  },
];
