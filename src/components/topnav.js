import React, { useState, useContext } from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

import '../app.scss';
import routes from './routes';
import { HarperDBContext } from '../providers/harperdb';

export default () => {
  const { setAuthorization, instances } = useContext(HarperDBContext);
  const [navOpen, toggleNav] = useState(false);
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const activeInstance = instances.find((i) => i.active);

  return (
    <Navbar id="app-nav" dark fixed="top" expand="md">
      <div className="navbar-brand">
        <div id="logo" title="HarperDB Logo" />
      </div>
      <NavbarToggler right onClick={() => toggleNav(!navOpen)} isOpen={navOpen} />
      <Collapse isOpen={navOpen} navbar>
        <Nav className="ml-auto" navbar>
          {activeInstance && (
            <Dropdown nav isOpen={dropdownOpen} toggle={() => setDropDownOpen(!dropdownOpen)}>
              <DropdownToggle title="Choose an Existing Instance Dropdown" caret color="black">
                {activeInstance.url}
              </DropdownToggle>
              <DropdownMenu>
                {instances.filter((i) => !i.active).map((i) => (
                  <DropdownItem title={`Choose Instance ${i.url}`} key={JSON.stringify(i)} onClick={() => setAuthorization(i)}>{i.url}</DropdownItem>
                ))}
                <DropdownItem title="Add New Instance" onClick={() => setAuthorization(false)}>Add New Instance</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          {routes.map((route) => route.label && (
            <NavItem key={route.path}>
              <NavLink exact onClick={() => toggleNav(false)} to={route.link || route.path}>{route.label}</NavLink>
            </NavItem>
          ))}
          <NavItem>
            <NavLink title="Log Out" exact onClick={() => setAuthorization(false)} to="/">
              <i className="fa fa-sign-out fa-lg" />
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};
