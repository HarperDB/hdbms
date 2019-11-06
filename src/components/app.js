import React, { useState, useContext } from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse } from '@nio/ui-kit';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';

import '../app.scss';
import routes from './routes';
import { HarperDBContext } from '../providers/harperdb';

export default () => {
  const { structure, setAuthorization } = useContext(HarperDBContext);
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
                  <NavLink onClick={() => toggleNav(false)} to={route.link || route.path}>{route.label}</NavLink>
                </NavItem>
              ))}
              <NavItem>
                <NavLink onClick={() => setAuthorization(false)} exact to="/">Log Out</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      )}
      <div id="app-container">
        <Switch>
          {routes.map((route) => (
            <Route key={route.path} exact component={route.component} path={route.path} />
          ))}
          <Redirect to="/" />
        </Switch>
      </div>
      <div id="app-bg" />
    </>
  );
};
