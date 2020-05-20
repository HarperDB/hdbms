import Users from './users';
import Billing from './billing';

export default ({ customer_id }) => [
  {
    component: Users,
    path: `/${customer_id}/users/:hash?`,
    link: 'users',
    icon: 'users',
  },
  {
    component: Billing,
    path: `/${customer_id}/billing`,
    link: 'billing',
    icon: 'credit-card-alt',
  },
];
