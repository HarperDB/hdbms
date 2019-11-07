import React, { useState, useContext } from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from '@nio/ui-kit';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';

import '../app.scss';
import routes from './routes';
import { HarperDBContext } from '../providers/harperdb';
import Login from '../pages/login';

export default () => {
  const { structure, setAuthorization, instances } = useContext(HarperDBContext);
  const [navOpen, toggleNav] = useState(false);
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const activeInstance = instances.find((i) => i.active);

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
              {activeInstance && (
                <Dropdown nav isOpen={dropdownOpen} toggle={() => instances.length !== 1 && setDropDownOpen(!dropdownOpen)}>
                  <DropdownToggle caret color="black">
                    {activeInstance.url}
                  </DropdownToggle>
                  <DropdownMenu>
                    {instances.filter((i) => !i.active).map((i) => (
                      <DropdownItem key={JSON.stringify(i)} onClick={() => setAuthorization(i)}>{i.url}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              )}
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
          <Login />
        )}
      </div>
      <div id="app-bg" />
    </>
  );
};
