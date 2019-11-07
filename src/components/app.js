import React, { useState, useContext } from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse } from '@nio/ui-kit';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';

import '../app.scss';
import routes from './routes';
import { HarperDBContext } from '../providers/harperdb';
import Login from '../pages/login';

export default () => {
  const { structure, setAuthorization, authError } = useContext(HarperDBContext);
  const [navOpen, toggleNav] = useState(false);

  return (
    <>
      { structure && (
        <Navbar id="app-nav" dark fixed="top" expand="md">
          <div className="navbar-brand">
            <NavLink to="/"><div id="logo" /></NavLink>
          </div>
          <NavbarToggler right onClick={() => toggleNav(!navOpen)} isOpen={navOpen} />
          <Collapse isOpen={navOpen} navbar>
            <Nav className="ml-auto" navbar>
              {routes.map((route) => route.label && (
                <NavItem key={route.path}>
                  <NavLink exact onClick={() => toggleNav(false)} to={route.link || route.path}>{route.label}</NavLink>
                </NavItem>
              ))}
              <NavItem>
                <NavLink exact onClick={() => setAuthorization(false)} to="/">Log Out</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
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
          <Login
            setAuthorization={setAuthorization}
            authError={authError}
          />
        )}
      </div>
      <div id="app-bg" />
    </>
  );
};
