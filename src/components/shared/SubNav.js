import React from 'react';
import { Navbar, Nav, NavItem } from 'reactstrap';
import SelectDropdown from 'react-select';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import routeIcon from '../../functions/select/routeIcon';
import ErrorFallback from './ErrorFallback';
import addError from '../../functions/api/lms/addError';

function SubNav({ routes = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = routes?.find((r) => r.link === location.pathname) || routes[0];

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <Navbar className="app-subnav">
        {currentRoute && (
          <>
            <Nav navbar className="instance-nav d-none d-md-flex">
              {routes.map((route) => (
                // react-router-dom as a team considers external urls to be outside of the scope
                // of the library. see https://github.com/remix-run/react-router/issues/1147#issuecomment-113180174
                route.external ?
                  <li key={route.path} className="nav-item">
                    <a className="nav-link" href={route.url}>
                        <i className={`d-none d-sm-inline-block fa me-1 fa-${route.icon}`} />
                        {route.label}
                    </a>
                  </li>
                :
                  <NavItem key={route.path}>
                    <NavLink title={route.link} className="nav-link" to={route.link || route.path}>
                      <i className={`d-none d-sm-inline-block fa me-1 fa-${route.icon}`} />
                      {route.label}
                    </NavLink>
                  </NavItem>
              ))}
            </Nav>
            <Nav navbar className="d-flex d-md-none">
              <SelectDropdown
                className="react-select-container"
                classNamePrefix="react-select"
                width="200px"
                onChange={({ value }) => navigate(value)}
                options={routes.filter((r) => r.link !== currentRoute.link).map((route) => ({ label: route.label, value: route.link, iconCode: route.iconCode }))}
                value={{ ...currentRoute, value: currentRoute?.link }}
                defaultValue={currentRoute?.link}
                isSearchable={false}
                isClearable={false}
                styles={{
                  option: (styles, { data }) => ({ ...styles, ...routeIcon(data.iconCode) }),
                  singleValue: (styles, { data }) => ({ ...styles, ...routeIcon(data.iconCode) }),
                }}
              />
            </Nav>
          </>
        )}
      </Navbar>
    </ErrorBoundary>
  );
}

export default SubNav;
