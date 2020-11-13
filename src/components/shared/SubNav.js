import React from 'react';
import { Navbar, Nav, NavItem } from 'reactstrap';
import SelectDropdown from 'react-select';
import { NavLink, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import routeIcon from '../../functions/select/routeIcon';
import ErrorFallback from './ErrorFallback';
import addError from '../../functions/api/lms/addError';

const SubNav = ({ routes = [] }) => {
  const history = useHistory();
  const location = useLocation();

  const currentRoute = routes?.find((r) => r.link === location.pathname) || routes[0];
  const activeRoute = {
    label: currentRoute.label,
    value: currentRoute.link,
    iconCode: currentRoute.iconCode,
  };

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <Navbar className="app-subnav">
        <Nav navbar className="instance-nav d-none d-md-flex">
          {routes.map((route) => (
            <NavItem key={route.path}>
              <NavLink title={route.link} className="nav-link" to={route.link || route.path}>
                <i className={`d-none d-sm-inline-block fa mr-1 fa-${route.icon}`} />
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
            onChange={({ value }) => history.push(value)}
            options={routes.filter((r) => r.link !== currentRoute.link).map((route) => ({ label: route.label, value: route.link, iconCode: route.iconCode }))}
            value={activeRoute}
            defaultValue={activeRoute.value}
            isSearchable={false}
            isClearable={false}
            styles={{
              option: (styles, { data }) => ({ ...styles, ...routeIcon(data.iconCode) }),
              singleValue: (styles, { data }) => ({ ...styles, ...routeIcon(data.iconCode) }),
            }}
          />
        </Nav>
      </Navbar>
    </ErrorBoundary>
  );
};

export default SubNav;
