import { lazy } from 'react';

const Profile = lazy(() => import('./profile'));

export default [
  {
    component: Profile,
    path: '/profile',
    link: 'profile',
    label: 'profile',
    icon: 'user',
    iconCode: 'f007',
  },
];
