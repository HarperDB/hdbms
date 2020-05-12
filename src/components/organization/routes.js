import Users from './users';
import Billing from './billing';

export default [
  {
    component: Users,
    path: '/organization/users/:hash?',
    link: 'users',
    icon: 'users',
  },
  {
    component: Billing,
    path: '/organization/billing',
    link: 'billing',
    icon: 'credit-card-alt',
  },
];
