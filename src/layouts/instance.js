import React, { useState } from 'react';
import { Collapse, Nav, Navbar, NavbarToggler, NavItem } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

export default ({ children }) => {
  const [navOpen, toggleNav] = useState(false);

  return (
    <>
      <Navbar id="app-subnav" fixed="top" expand="md">
        <NavbarToggler right onClick={() => toggleNav(!navOpen)} isOpen={navOpen} />
        <Collapse isOpen={navOpen} navbar>
          <Nav className="mx-auto" navbar>
            <NavItem>
              <NavLink onClick={() => toggleNav(false)} to="/instances/default/browse">Browse</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => toggleNav(false)} to="/instances/default/clustering">Clustering</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => toggleNav(false)} to="/instances/default/configuration">Configuration</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => toggleNav(false)} to="/instances/default/enterprise">Enterprise</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <div id="app-container">
        {children}
      </div>
    </>
  );
};
