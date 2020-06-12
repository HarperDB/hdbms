import Users from './users';
import Billing from './billing';

export default ({ customer_id }) => [
  {
    component: Users,
    path: `/o/:customer_id/users/:user_id?`,
    link: `/o/${customer_id}/users`,
    label: 'users',
    icon: 'users',
    iconCode: 'f0c0',
  },
  {
    component: Billing,
    path: `/o/:customer_id/billing`,
    link: `/o/${customer_id}/billing`,
    label: 'billing',
    icon: 'credit-card-alt',
    iconCode: 'f283',
  },
];
