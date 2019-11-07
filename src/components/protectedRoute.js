import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default ({ component: Comp, loggedIn, path, ...rest }) => (
  <Route
    path={path}
    {...rest}
    render={(props) => (
      loggedIn ? <Comp {...props} />
        : <Redirect to={{ pathname: '/', state: { prevLocation: path, error: 'You need to login first!' } }} />
    )}
  />
);
