import React, { useMemo } from 'react';
import { Navbar, Nav, NavItem, NavLink as DumbLink } from '@nio/ui-kit';
import { NavLink, useLocation } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../state/appState';

import usePersistedUser from '../state/persistedUser';

const TopNav = ({ logOut }) => {
  const { pathname } = useLocation();
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const { auth, customer } = useStoreState(appState, (s) => ({
    auth: s.auth,
    customer: s.customer,
  }));
  const showInviteBadge = useMemo(() => auth?.orgs?.filter((org) => org.status === 'invited').length, [auth.orgs]);
  const showManageIcon = useMemo(() => auth?.orgs?.find((o) => o.customer_id === customer?.customer_id)?.status === 'owner', [auth.orgs, customer.customer_id]);

  return (
    <Navbar id="app-nav" dark fixed="top" expand="xs">
      <div className="navbar-brand">
        <div id="logo" title="HarperDB Logo" />
      </div>
      <Nav className="ml-auto" navbar>
        <NavItem className="ml-3">
          <NavLink title="View or Switch Organizations" to="/organizations">
            <i className="fa fa-building-o d-inline-block" />
            <span className="d-none d-lg-inline-block">&nbsp; All Organizations</span>
            {showInviteBadge ? <span className="invite-badge">{showInviteBadge}</span> : null}
          </NavLink>
        </NavItem>
        <div className={`active-org ml-3 ${customer && pathname.indexOf(customer?.customer_id) !== -1 ? 'open' : ''}`}>
          <div className="text-white org-name">{customer.customer_name}</div>
          <div className="org-actions">
            <NavItem>
              <NavLink disabled title="View Organization Instances" exact to={`/${customer.customer_id}/instances`}>
                <i className="fa fa-th d-inline-block" />
                <span className="d-none d-lg-inline-block">&nbsp; Instances</span>
              </NavLink>
            </NavItem>
            {showManageIcon && (
              <>
                <NavItem className="mr-3" />
                <NavItem>
                  <NavLink disabled title="Manage Organization" to={`/${customer.customer_id}/users`}>
                    <i className="fa fa-gears d-inline-block" />
                    <span className="d-none d-lg-inline-block">&nbsp; Manage</span>
                  </NavLink>
                </NavItem>
              </>
            )}
          </div>
        </div>
        <NavItem className="ml-3">
          <NavLink title="Manage My Profile" to="/profile">
            <i className="fa fa-user" />
          </NavLink>
        </NavItem>
        <NavItem className="ml-3">
          <NavLink title="View Support Documentation" to="/support">
            <i className="fa fa-support" />
          </NavLink>
        </NavItem>
        <NavItem className="ml-3">
          <DumbLink
            tabIndex="0"
            title={persistedUser.darkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            onKeyDown={(e) => e.keyCode !== 13 || setPersistedUser({ ...persistedUser, darkTheme: !persistedUser.darkTheme })}
            onClick={() => setPersistedUser({ ...persistedUser, darkTheme: !persistedUser.darkTheme })}
          >
            <i className={`fa ${persistedUser.darkTheme ? 'fa-moon-o' : 'fa-sun-o'}`} />
          </DumbLink>
        </NavItem>
        <NavItem className="ml-3">
          <DumbLink tabIndex="0" title="Log Out" onKeyDown={(e) => e.keyCode !== 13 || logOut()} onClick={logOut}>
            <i className="fa fa-sign-out" />
          </DumbLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default TopNav;
