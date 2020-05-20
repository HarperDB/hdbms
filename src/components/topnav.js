import React, { useCallback, useMemo } from 'react';
import { Navbar, Nav, NavItem, NavLink as DumbLink } from '@nio/ui-kit';
import { NavLink, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';

import appState from '../state/appState';

import usePersistedUser from '../state/persistedUser';
import themeState from '../state/themeState';

const TopNav = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const [, setPersistedUser] = usePersistedUser({});
  const [darkTheme, setDarkTheme] = themeState(false);
  const { auth, customer } = useStoreState(appState, (s) => ({
    auth: s.auth,
    customer: s.customer,
  }));
  const showInviteBadge = useMemo(() => auth?.orgs?.filter((org) => org.status === 'invited').length, [auth.orgs]);
  const showManageIcon = useMemo(() => auth?.orgs?.find((o) => o.customer_id === customer?.customer_id)?.status === 'owner', [auth.orgs, customer.customer_id]);

  const logOut = useCallback(() => {
    setPersistedUser(false);
    appState.update((s) => {
      s.auth = false;
      s.customer = false;
      s.users = false;
      s.instances = false;
      s.hasCard = false;
      s.lastUpdate = false;
    });
    setTimeout(() => history.push('/sign-in'), 100);
  }, []);

  return auth ? (
    <Navbar id="app-nav" dark fixed="top" expand="xs">
      <div className="navbar-brand">
        <div id="logo" title="HarperDB Logo" />
      </div>
      <Nav className="ml-auto" navbar>
        <NavItem className="ml-3">
          <NavLink title="View or Switch Organizations" to="/organizations">
            <i className="fa fa-building-o d-inline-block" />
            <span className="d-none d-md-inline-block">&nbsp; Organizations</span>
            {showInviteBadge ? <span className="invite-badge">{showInviteBadge}</span> : null}
          </NavLink>
        </NavItem>
        {customer && pathname !== '/organizations' && (
          <>
            <NavItem className="ml-3 text-white">&gt;</NavItem>
            <NavItem className="ml-3 text-white">{customer.customer_name}</NavItem>
            <NavItem className="ml-3 text-white">|</NavItem>
            {showManageIcon && (
              <NavItem className="ml-3">
                <NavLink disabled title="Manage Organization" to={`/${customer.customer_id}/users`}>
                  <i className="fa fa-gears d-inline-block" />
                  <span className="d-none d-md-inline-block">&nbsp; Manage</span>
                </NavLink>
              </NavItem>
            )}
            <NavItem className="ml-3">
              <NavLink disabled title="View Organization Instances" exact to={`/${customer.customer_id}/instances`}>
                <i className="fa fa-th d-inline-block" />
                <span className="d-none d-md-inline-block">&nbsp; Instances</span>
              </NavLink>
            </NavItem>
          </>
        )}
        <NavItem className="ml-3 text-white">|</NavItem>
        <NavItem className="ml-3">
          <NavLink title="Manage My Profile" to="/profile">
            <i className="fa fa-user d-inline-block" />
            <span className="d-none d-md-inline-block">&nbsp; Profile</span>
          </NavLink>
        </NavItem>
        <NavItem className="ml-3">
          <NavLink title="View Support Documentation" to="/support">
            <i className="fa fa-support d-inline-block" />
            <span className="d-none d-md-inline-block">&nbsp;Help</span>
          </NavLink>
        </NavItem>
        <NavItem className="ml-3">
          <DumbLink
            tabIndex="0"
            title={darkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            onKeyDown={(e) => e.keyCode !== 13 || setDarkTheme(!darkTheme)}
            onClick={() => setDarkTheme(!darkTheme)}
          >
            <i className={`fa fa-toggle-${darkTheme ? 'on' : 'off'} d-inline-block`} />
            <span className="d-none d-md-inline-block">&nbsp;Dark</span>
          </DumbLink>
        </NavItem>
        <NavItem className="ml-3">
          <DumbLink tabIndex="0" title="Log Out" onKeyDown={(e) => e.keyCode !== 13 || logOut()} onClick={logOut}>
            <i className="fa fa-sign-out d-inline-block" />
            <span className="d-none d-md-inline-block">&nbsp;Log Out</span>
          </DumbLink>
        </NavItem>
      </Nav>
    </Navbar>
  ) : null;
};

export default TopNav;
