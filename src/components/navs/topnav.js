import React from 'react';
import { Navbar, Nav, NavItem, NavLink as DumbLink } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

export default ({ logOut }) => (
  <Navbar id="app-nav" dark fixed="top" expand="xs">
    <div className="navbar-brand">
      <div id="logo" title="HarperDB Logo" />
    </div>
    <Nav className="ml-auto" navbar>
      <NavItem>
        <NavLink title="View Instances" to="/instances">
          <i className="fa fa-th fa-lg d-sm-none d-inline-block" />
          <i className="fa fa-th d-none d-sm-inline-block" />
          &nbsp;
          <span className="d-none d-sm-inline-block">Instances</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink title="Manage Account" to="/account">
          <i className="fa fa-gear fa-lg d-sm-none d-inline-block" />
          <i className="fa fa-gear d-none d-sm-inline-block" />
          &nbsp;
          <span className="d-none d-sm-inline-block">Account</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <DumbLink title="Log Out" onClick={logOut}>
          <i className="fa fa-sign-out fa-lg d-sm-none d-inline-block" />
          <i className="fa fa-sign-out d-none d-sm-inline-block" />
          &nbsp;
          <span className="d-none d-sm-inline-block">Log Out</span>
        </DumbLink>
      </NavItem>
    </Nav>
  </Navbar>
);
