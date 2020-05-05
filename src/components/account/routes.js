import Users from './users';
import Billing from './billing';

export default [
  {
    component: Users,
    path: '/account/users/:hash?',
    link: 'users',
    icon: 'users',
  },
  {
    component: Billing,
    path: '/account/billing',
    link: 'billing',
    icon: 'credit-card-alt',
  },
];
