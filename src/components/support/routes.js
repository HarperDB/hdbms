import Resources from './resources';
import Installation from './installation';
import Drivers from './drivers';

export default [
  {
    component: Installation,
    path: '/support/installation',
    link: 'installation',
    icon: 'wrench',
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
