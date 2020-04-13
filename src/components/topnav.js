import React from 'react';
import { Navbar, Nav, NavItem, NavLink as DumbLink } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';

import appState from '../state/appState';
import usePersistedLMSAuth from '../state/persistedLMSAuth';

const TopNav = () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const history = useHistory();
  const [, setPersistedLMSAuth] = usePersistedLMSAuth({});

  const logOut = () => {
    setPersistedLMSAuth(false);
    appState.update((s) => {
      s.auth = false;
    });
    setTimeout(() => history.push('/sign-in'), 100);
  };

  return auth?.email && auth?.pass ? (
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
        <NavItem className="ml-3">
          <NavLink title="Manage Account" to="/account">
            <i className="fa fa-gear fa-lg d-sm-none d-inline-block" />
            <i className="fa fa-gear d-none d-sm-inline-block" />
            &nbsp;
            <span className="d-none d-sm-inline-block">Account</span>
          </NavLink>
        </NavItem>
        <NavItem className="ml-3">
          <DumbLink title="Log Out" onClick={logOut}>
            <i className="fa fa-sign-out fa-lg d-sm-none d-inline-block" />
            <i className="fa fa-sign-out d-none d-sm-inline-block" />
            &nbsp;
            <span className="d-none d-sm-inline-block">Log Out</span>
          </DumbLink>
        </NavItem>
      </Nav>
    </Navbar>
  ) : null;
};

export default TopNav;
