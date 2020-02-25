import Profile from '../components/account/profile';
import Users from '../components/account/users';
import Billing from '../components/account/billing';

export default [
  { component: Profile, path: '/account/profile', link: 'profile', icon: 'user' },
  { component: Users, path: '/account/users/:hash?', link: 'users', icon: 'users' },
  { component: Billing, path: '/account/billing', link: 'billing', icon: 'credit-card-alt' },
];
