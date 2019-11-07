import React, { useState, useContext } from 'react';
import { Navbar, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

import { HarperDBContext } from '../providers/harperdb';

export default () => {
  const { structure, setAuthorization } = useContext(HarperDBContext);
  const [dropdownOpen, setDropDownOpen] = useState(false);

  return (
    <Navbar id="app-nav" fixed="top" expand="xs">
      <div className="navbar-brand">
        <NavLink to="/"><div id="logo" /></NavLink>
      </div>
      <Nav className="ml-auto" navbar>
        <Dropdown nav isOpen={dropdownOpen} toggle={() => setDropDownOpen(!dropdownOpen)}>
          <DropdownToggle caret color="black">
            default
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>joyluck-club</DropdownItem>
            <DropdownItem>angry-panther</DropdownItem>
            <DropdownItem>junkie-hoodlum</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>add new instance</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavItem>
          <NavLink to="/docs">
            <i className="fa fa-info-circle fa-lg" />
          </NavLink>
        </NavItem>
        { structure ? (
          <NavItem>
            <NavLink exact onClick={() => setAuthorization(false)} to="/">
              <i className="fa fa-sign-out fa-lg" />
            </NavLink>
          </NavItem>
        ) : (
          <NavItem>
            <NavLink exact to="/">
              <i className="fa fa-sign-in fa-lg" />
            </NavLink>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
}
