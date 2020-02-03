import React, { useState } from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse, NavLink as DumbLink } from '@nio/ui-kit';
import { useParams, useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';

import routes from './instance/routes';
import useLMS from '../stores/lmsData';
import defaultLMSData from '../util/defaultLMSData';

export default () => {
  const { instance_id } = useParams();
  const history = useHistory();
  const [lmsData, setLMSData] = useLMS(defaultLMSData);
  const [navOpen, toggleNav] = useState(false);

  return (
    <Navbar id="app-nav" dark fixed="top" expand="md">
      <div className="navbar-brand">
        <div id="logo" title="HarperDB Logo" />
      </div>
      <NavbarToggler right onClick={() => toggleNav(!navOpen)} isOpen={navOpen} />
      <Collapse isOpen={navOpen} navbar>
        <Nav className="ml-auto" navbar>
          {instance_id && lmsData.instances.length && (
            <>
              <NavItem>
                <NavLink onClick={() => toggleNav(false)} exact to="/instances">All Instances</NavLink>
              </NavItem>
              <NavItem className="d-none d-md-block">
                <span className="nav-divider">&gt;</span>
              </NavItem>
              <NavItem>
                <span className="nav-divider">{lmsData.instances.find((i) => i.id === instance_id).name}</span>
              </NavItem>
              <NavItem className="d-none d-md-block">
                <span className="nav-divider">&gt;</span>
              </NavItem>
              {routes.map((route) => (
                <NavItem key={route.path}>
                  <NavLink className="text-capitalize" onClick={() => toggleNav(false)} to={`/instances/${instance_id}/${route.link}`}>{route.link}</NavLink>
                </NavItem>
              ))}
              <NavItem className="d-none d-md-block">
                <span className="nav-divider">|</span>
              </NavItem>
            </>
          )}
          <NavItem>
            <DumbLink title="Log Out" onClick={() => { setLMSData(defaultLMSData); setTimeout(() => history.push('/'), 0); }}>
              <i className="fa fa-sign-out fa-lg" />
            </DumbLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};
