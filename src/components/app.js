import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';

import { HarperDBContext } from '../providers/harperdb';
import TopNav from './topnav';
import Routes from '../routes';
import '../app.scss';

export default () => {
  const { structure } = useContext(HarperDBContext);
  const history = useHistory();

  let redirectTimeout = false;
  useAsyncEffect(() => {
    redirectTimeout = setTimeout(() => {
      if (!!structure && history.location.pathname === '/') {
        history.push('/instances');
      } else if (structure && history.location.pathname !== '/') {
        history.push('/');
      }
    }, 100);
  },
  () => clearTimeout(redirectTimeout),
  [structure]);

  return (
    <>
      <TopNav />
      <Routes />
      <div id="app-bg" />
    </>
  );
};
