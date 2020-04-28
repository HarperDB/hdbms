import React from 'react';
import { Navbar, Nav, NavItem } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

export default ({ routes = [] }) => (
  <Navbar className="app-subnav">
    <Nav navbar>
      {routes.map((route) => (
        <NavItem key={route.path}>
          <NavLink className="text-capitalize" to={`/support/${route.link}`}>
            <i className={`fa mr-2 fa-${route.icon}`} />
            {route.link}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  </Navbar>
);
