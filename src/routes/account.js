import Profile from '../components/account/profile';
import Users from '../components/account/users';
import Subscription from '../components/account/subscription';
import Billing from '../components/account/billing';

export default [
  { component: Profile, path: '/account/profile', link: 'profile', icon: 'user' },
  { component: Users, path: '/account/users', link: 'users', icon: 'users' },
  { component: Subscription, path: '/account/subscription', link: 'subscription', icon: 'list' },
  { component: Billing, path: '/account/billing', link: 'billing', icon: 'credit-card-alt' },
];
