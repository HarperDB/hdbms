import React from 'react';
import { Navbar, Nav, NavItem } from 'reactstrap';
import SelectDropdown from 'react-select';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useHistory } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../state/appState';
import instanceState from '../../state/instanceState';

import icon from '../../methods/select/icon';
import routeIcon from '../../methods/select/routeIcon';
import ErrorFallback from '../shared/errorFallback';
import addError from '../../api/lms/addError';
import useInstanceAuth from '../../state/instanceAuths';

export default ({ routes = [] }) => {
  const { compute_stack_id, customer_id } = useParams();
  const [instanceAuths] = useInstanceAuth({});
  const history = useHistory();
  const location = useLocation();
  const defaultBrowseURL = useStoreState(instanceState, (s) => s.defaultBrowseURL);
  const { options, activeOption } = useStoreState(
    appState,
    (s) => {
      const selectedInstance = s.instances && s.instances.find((i) => i.compute_stack_id === compute_stack_id);
      const otherInstances = s.instances && s.instances.filter((i) => i.compute_stack_id !== compute_stack_id);
      return {
        options:
          otherInstances &&
          otherInstances.map((i) => ({
            label: `${i.instance_name} ${
              ['CREATE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK'].includes(i.status) ? `(${i.status.replace(/_/g, ' ').toLowerCase()})` : ''
            }`,
            value: i.compute_stack_id,
            is_local: i.is_local,
            has_auth: instanceAuths[i.compute_stack_id],
            is_unavailable: ['CREATE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK'].includes(i.status),
          })),
        activeOption: {
          label: selectedInstance?.instance_name,
          value: compute_stack_id,
          is_local: selectedInstance?.is_local,
        },
      };
    },
    [compute_stack_id]
  );
  const currentRoute = routes?.find((r) => r.link === location.pathname.split(compute_stack_id)[1].split('/')[1]);
  const activeRoute = {
    label: currentRoute?.label,
    value: currentRoute?.link,
    iconCode: currentRoute?.iconCode,
  };

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <Navbar className="app-subnav">
        <Nav navbar className="instance-select">
          <SelectDropdown
            className="react-select-container"
            classNamePrefix="react-select"
            onChange={({ value, has_auth, is_unavailable }) =>
              is_unavailable ? false : has_auth ? history.push(`/o/${customer_id}/i/${value}/${activeRoute.value}`) : history.push(`/o/${customer_id}/instances/login`)
            }
            options={options || []}
            value={activeOption}
            defaultValue={activeOption.value}
            isSearchable={false}
            isClearable={false}
            isLoading={!options}
            noOptionsMessage={() => 'No other instances available'}
            styles={{
              option: (styles, { data }) => ({ ...styles, opacity: data.is_unavailable ? 0.5 : 1, ...icon(data.is_local, data.is_unavailable) }),
              singleValue: (styles, { data }) => ({ ...styles, ...icon(data.is_local, data.is_unavailable) }),
            }}
          />
        </Nav>
        <Nav navbar className="instance-nav d-none d-lg-flex">
          {routes.map((route) => (
            <NavItem key={route.path}>
              <NavLink
                title={route.link}
                className="nav-link"
                isActive={(match, browserLoc) => match || (route.link === 'browse' && browserLoc.pathname.indexOf('/browse/') !== -1)}
                to={`/o/${customer_id}/i/${compute_stack_id}/${route.link === 'browse' ? `${route.link}/${defaultBrowseURL}` : route.link}`}
              >
                <i className={`d-none d-sm-inline-block fa mr-1 fa-${route.icon}`} />
                {route.label || route.link}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <Nav navbar className="instance-nav-select d-flex d-lg-none">
          <SelectDropdown
            className="react-select-container"
            classNamePrefix="react-select"
            width="200px"
            onChange={({ value }) => history.push(`/o/${customer_id}/i/${compute_stack_id}/${value}`)}
            options={
              activeRoute.value ? routes.filter((r) => r.link !== activeRoute.value).map((route) => ({ label: route.label, value: route.link, iconCode: route.iconCode })) : null
            }
            isLoading={!activeRoute.value}
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
