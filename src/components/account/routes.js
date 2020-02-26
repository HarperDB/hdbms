import Profile from './profile';
import Users from './users';
import Billing from './billing';

export default [
  { component: Profile, path: '/account/profile', link: 'profile', icon: 'user' },
  { component: Users, path: '/account/users/:hash?', link: 'users', icon: 'users' },
  { component: Billing, path: '/account/billing', link: 'billing', icon: 'credit-card-alt' },
];
