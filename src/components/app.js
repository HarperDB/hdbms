import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import '../app.scss';
import routes from './routes';
import { HarperDBContext } from '../providers/harperdb';
import Login from '../pages/login';
import TopNav from './topnav';

export default () => {
  const { structure } = useContext(HarperDBContext);

  return (
    <>
      { structure && (
        <TopNav />
      )}
      <div id="app-container">
        { structure ? (
          <Switch>
            {routes.map((route) => (
              <Route key={route.path} component={route.component} path={route.path} />
            ))}
            <Redirect to={structure ? '/browse' : '/'} />
          </Switch>
        ) : (
          <Login />
        )}
      </div>
      <div id="app-bg" />
    </>
  );
};
