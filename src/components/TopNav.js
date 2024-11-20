import React, { useMemo } from 'react';
import { Navbar, Nav, NavItem, Button } from 'reactstrap';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';
import appState from '../functions/state/appState';
import addError from '../functions/api/lms/addError';
import ErrorFallback from './shared/ErrorFallback';
import useInstanceAuth from '../functions/state/instanceAuths';
import config from '../config';
import usePersistedUser from '../functions/state/persistedUser';
function TopNav({
  isMaintenance,
  loggedIn = false
}) {
  const {
    pathname
  } = useLocation();
  const navigate = useNavigate();
  const auth = useStoreState(appState, s => s.auth);
  const customer = useStoreState(appState, s => s.customer);
  const theme = useStoreState(appState, s => s.theme);
  const themes = useStoreState(appState, s => s.themes);
  const [, setInstanceAuths] = useInstanceAuth({});
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const themeIndex = themes?.findIndex(t => t === theme);
  const nextTheme = !theme || themeIndex === themes.length - 1 ? themes[0] : themes[themeIndex + 1];
  const showInviteBadge = useMemo(() => auth?.orgs?.filter(org => org.status === 'invited').length,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [auth.orgs]);
  const showManageIcon = useMemo(() => auth?.orgs?.find(o => o.customerId?.toString() === customer?.customerId?.toString())?.status === 'owner',
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [auth.orgs, customer.customerId]);
  const toggleTheme = newValue => {
    setPersistedUser({
      ...persistedUser,
      theme: newValue
    });
    appState.update(s => {
      s.theme = newValue;
    });
  };
  const logOut = () => {
    if (config.isLocalStudio) {
      setInstanceAuths({
        local: false
      });
    } else {
      appState.update(s => {
        s.auth = false;
      });
    }
    navigate('/');
  };
  return <ErrorBoundary onError={(error, componentStack) => addError({
    error: {
      message: error.message,
      componentStack
    },
    customerId: customer?.customerId,
    computeStackId: null
  })} FallbackComponent={ErrorFallback}>
      <Navbar id="app-nav" dark fixed="top" expand="xs">
        <div className="navbar-brand">
          <NavLink to={config.isLocalStudio ? `o/local/i/local/browse` : '/organizations'}>
            <div id="logo" title="Go to Organizations Home" />
          </NavLink>
        </div>

        <Nav className="ms-auto" navbar>
          {loggedIn && !isMaintenance && !config.isLocalStudio && <>
              <NavItem className="ms-0">
                <NavLink id="viewOrganizations" title="View or Switch Organizations" to="/organizations">
                  <i className="fa fa-building d-inline-block" />
                  <span className="d-none d-lg-inline-block">&nbsp;all organizations</span>
                  {showInviteBadge ? <span className="badge">{showInviteBadge}</span> : null}
                </NavLink>
              </NavItem>
              <div className={`active-org ${customer && pathname.indexOf(customer?.customerId) !== -1 ? 'open' : ''}`}>
                <div className="text-white org-name">{customer.customerName}</div>
                <div className="org-actions">
                  <NavItem className="ms-0">
                    <NavLink id="viewOrganizationInstances" title="View Organization Instances" to={`/o/${customer.customerId}/instances`}>
                      <i className="fa fa-th d-inline-block" />
                      <span className="d-none d-lg-inline-block">&nbsp;instances</span>
                    </NavLink>
                  </NavItem>
                  {showManageIcon && <>
                      <NavItem>
                        <NavLink id="manageOrganizationUsers" title="Manage Organization Users" to={`/o/${customer.customerId}/users`}>
                          <i className="fa fa-users d-inline-block" />
                          <span className="d-none d-lg-inline-block">&nbsp;users</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink id="manageOrganizationBilling" title="Manage Organization Billing" to={`/o/${customer.customerId}/billing`}>
                          <i className="fa fa-credit-card d-inline-block" />
                          <span className="d-none d-lg-inline-block">&nbsp;billing</span>
                          {customer?.currentPaymentStatus?.status === 'invoice.payment_failed' ? <span className="badge">!</span> : null}
                        </NavLink>
                      </NavItem>
                    </>}
                </div>
              </div>
              <NavItem>
                <NavLink id="manageProfile" title="Manage My Profile" to="/profile">
                  <i className="fa fa-user" />
                  <span className="d-none d-lg-inline-block">&nbsp;profile</span>
                  {auth?.emailBounced ? <span className="badge">!</span> : null}
                </NavLink>
              </NavItem>
            </>}
          {themes.length > 1 && <NavItem>
              <Button color="link" id="changeTheme" tabIndex="0" title={`Switch to ${nextTheme} theme`} onKeyDown={e => e.keyCode !== 13 || toggleTheme(nextTheme)} onClick={() => toggleTheme(nextTheme)}>
                <i className="fas fa-palette" />
                <span className="d-none d-lg-inline-block">&nbsp;theme</span>
              </Button>
            </NavItem>}
          {!config.isLocalStudio && <li className="nav-item">
              <a target="_blank" rel="noreferrer" href="https://harperdb.io/docs" id="viewResources" title="HarperDB Documentation">
                <i className="fas fa-tools" />
                <span className="d-none d-lg-inline-block">&nbsp;docs</span>
              </a>
            </li>}
          <NavItem>
            {loggedIn ? <Button id="logOut" tabIndex="0" color="link" title="Log Out" onKeyDown={e => e.keyCode !== 13 || logOut()} onClick={logOut}>
                <i className="fa fa-sign-out-alt" />
                <span className="d-none d-lg-inline-block login-text-label">&nbsp;sign out</span>
              </Button> : <NavLink id="goToLogin" title="Log In" to="/">
                <i className="fa fa-sign-in-alt" />
                <span className="d-none d-lg-inline-block login-text-label">&nbsp;sign in</span>
              </NavLink>}
          </NavItem>
        </Nav>
      </Navbar>
    </ErrorBoundary>;
}
export default TopNav;