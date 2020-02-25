import React from 'react';
import { Navbar, Nav, NavItem } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

export default ({ routes = [], instanceId }) => (
  <Navbar id="app-subnav" fixed="top" expand="xs">
    <Nav navbar>
      {routes.map((route) => (
        <NavItem key={route.path}>
          <NavLink className="text-capitalize" to={`/instances/${instanceId}/${route.link}`}>{route.link}</NavLink>
        </NavItem>
      ))}
    </Nav>
  </Navbar>
);
