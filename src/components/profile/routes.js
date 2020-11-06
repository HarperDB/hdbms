import { lazy } from 'react';

const Profile = lazy(() => import(/* webpackChunkName: "profile" */ './profile'));

const Routes = [
  {
    component: Profile,
    path: '/profile',
    link: 'profile',
    label: 'profile',
    icon: 'user',
    iconCode: 'f007',
  },
];

export default Routes;
