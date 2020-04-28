import React from 'react';
import { Navbar, Nav, NavItem, NavLink as DumbLink } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';

import appState from '../state/appState';

import usePersistedLMSAuth from '../state/persistedLMSAuth';
import useDarkTheme from '../state/darkTheme';

const TopNav = () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const history = useHistory();
  const [, setPersistedLMSAuth] = usePersistedLMSAuth({});
  const [darkTheme, setDarkTheme] = useDarkTheme(false);

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
            <span className="d-none d-sm-inline-block">
              <i className="fa fa-th" />
              &nbsp; Instances
            </span>
          </NavLink>
        </NavItem>
        <NavItem className="ml-3">
          <NavLink title="Manage Account" to="/account">
            <i className="fa fa-gear fa-lg d-sm-none d-inline-block" />
            <span className="d-none d-sm-inline-block">
              <i className="fa fa-gear" />
              &nbsp;Account
            </span>
          </NavLink>
        </NavItem>
        <NavItem className="ml-3">
          <NavLink title="Manage Account" to="/support">
            <i className="fa fa-support fa-lg d-sm-none d-inline-block" />
            <span className="d-none d-sm-inline-block">
              <i className="fa fa-support" />
              &nbsp;Support
            </span>
          </NavLink>
        </NavItem>
        <NavItem className="ml-3">
          <DumbLink title="Log Out" onClick={() => setDarkTheme(!darkTheme)}>
            <i className={`fa fa-toggle-${darkTheme ? 'on' : 'off'} fa-lg d-sm-none d-inline-block`} />
            <span className="d-none d-sm-inline-block">
              <i className={`fa fa-toggle-${darkTheme ? 'on' : 'off'}`} />
              &nbsp;Dark
            </span>
          </DumbLink>
        </NavItem>
        <NavItem className="ml-3">
          <DumbLink title="Log Out" onClick={logOut}>
            <i className="fa fa-sign-out fa-lg d-sm-none d-inline-block" />
            <span className="d-none d-sm-inline-block">
              <i className="fa fa-sign-out" />
              &nbsp;Log Out
            </span>
          </DumbLink>
        </NavItem>
      </Nav>
    </Navbar>
  ) : null;
};

export default TopNav;
