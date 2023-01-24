import { lazy, React } from 'react';

const Users = lazy(() => import(/* webpackChunkName: "organization-users" */ './users'));
const Billing = lazy(() => import(/* webpackChunkName: "organization-billing" */ './billing'));

const Routes = ({ customer_id }) => [
  {
    element: <Users />,
    path: `/o/:customer_id/users/:user_id?`,
    link: `/o/${customer_id}/users`,
    label: 'users',
    icon: 'users',
    iconCode: 'f0c0',
  },
  {
    element: <Billing />,
    path: `/o/:customer_id/billing`,
    link: `/o/${customer_id}/billing`,
    label: 'billing',
    icon: 'credit-card-alt',
    iconCode: 'f283',
  },
];

export default Routes;
