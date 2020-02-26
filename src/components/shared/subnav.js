import React, { useLayoutEffect, useState } from 'react';
import { Navbar, Nav, NavItem } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

export default ({ routes = [], instanceId = false }) => {
  const [showSubnav, setShowSubnav] = useState(false);
  useLayoutEffect(() => {
    setTimeout(() => setShowSubnav(true), 0);
  });
  return (
    <Navbar id="app-subnav" fixed="top" expand="xs" className={`${showSubnav ? 'show' : ''}`}>
      <Nav navbar>
        {routes.map((route) => (
          <NavItem key={route.path}>
            <NavLink className="text-capitalize" to={instanceId ? `/instances/${instanceId}/${route.link}` : `/account/${route.link}`}>
              <i className={`d-none d-sm-inline-block fa mr-2 fa-${route.icon}`} />
              {route.link}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </Navbar>
  );
};
