import React from 'react';
import { Navbar, Nav, NavItem } from 'reactstrap';
import SelectDropdown from 'react-select';
import { NavLink, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../functions/state/appState';
import instanceState from '../../functions/state/instanceState';

import icon from '../../functions/select/icon';
import routeIcon from '../../functions/select/routeIcon';
import ErrorFallback from '../shared/ErrorFallback';
import addError from '../../functions/api/lms/addError';
import useInstanceAuth from '../../functions/state/instanceAuths';

function Subnav({ routes = [] }) {
  const { compute_stack_id, customer_id } = useParams();
  const [instanceAuths] = useInstanceAuth({});
  const navigate = useNavigate();
  const location = useLocation();
  const defaultBrowseURL = useStoreState(instanceState, (s) => s.defaultBrowseURL);
  const alarms = useStoreState(appState, (s) => s.alarms && s.alarms[compute_stack_id]?.alarmCounts.total, [compute_stack_id]);
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


  const navigateFn = ({ value, has_auth, is_unavailable }) => {
    if (!is_unavailable) {
      return false
    }
    if (has_auth) {
      navigate(`/o/${customer_id}/i/${value}/${activeRoute.value}`)
    } else {
      navigate(`/o/${customer_id}/instances/login`)
    }
  }

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <Navbar className="app-subnav">
        <Nav navbar className="instance-select">
          <SelectDropdown
            className="react-select-container"
            classNamePrefix="react-select"
            onChange={navigateFn}
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
                to={`/o/${customer_id}/i/${compute_stack_id}/${route.link === 'browse' ? `${route.link}/${defaultBrowseURL}` : route.link}`}
              >
                <i className={`d-none d-sm-inline-block fa me-1 fa-${route.icon}`} />
                {route.label || route.link}
                {!!alarms && route.link === 'status' && <span className="badge">{alarms}</span>}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <Nav navbar className="instance-nav-select d-flex d-lg-none">
          <SelectDropdown
            className="react-select-container"
            classNamePrefix="react-select"
            width="200px"
            onChange={({ value }) => navigate(`/o/${customer_id}/i/${compute_stack_id}/${value}`)}
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
}

export default Subnav;
