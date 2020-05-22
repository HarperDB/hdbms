import Users from './users';
import Billing from './billing';

export default ({ customer_id }) => [
  {
    component: Users,
    path: `/${customer_id}/users/:hash?`,
    link: 'users',
    icon: 'users',
    iconCode: 'f0c0',
  },
  {
    component: Billing,
    path: `/${customer_id}/billing`,
    link: 'billing',
    icon: 'credit-card-alt',
    iconCode: 'f283',
  },
];
