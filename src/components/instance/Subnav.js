import React from 'react';
import { Navbar, Nav, NavItem } from 'reactstrap';
import SelectDropdown from 'react-select';
import { NavLink, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';
import appState from '../../functions/state/appState';
import instanceState from '../../functions/state/instanceState';
import ErrorFallback from '../shared/ErrorFallback';
import addError from '../../functions/api/lms/addError';
import useInstanceAuth from '../../functions/state/instanceAuths';
import config from '../../config';
function Subnav({
  routes = []
}) {
  const {
    computeStackId,
    customerId
  } = useParams();
  const [instanceAuths] = useInstanceAuth({});
  const navigate = useNavigate();
  const location = useLocation();
  const defaultBrowseURL = useStoreState(instanceState, s => s.defaultBrowseURL);
  const alarms = useStoreState(appState, s => s.alarms && s.alarms[computeStackId]?.alarmCounts.total, [computeStackId]);
  const {
    options,
    activeOption
  } = useStoreState(appState, s => {
    const selectedInstance = s.instances && s.instances.find(i => i.computeStackId === computeStackId);
    const otherInstances = s.instances && s.instances.filter(i => i.computeStackId !== computeStackId);
    return {
      options: otherInstances && otherInstances.map(i => ({
        label: <span>
                <i className={`d-none d-sm-inline-block fa me-2 fa-${i.isLocal ? 'server' : ['CREATE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK'].includes(i.status) ? 'circle-exclamation' : 'cloud'} ${['CREATE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK'].includes(i.status) && 'opacity-25'}`} />
                {i.instanceName} {['CREATE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK'].includes(i.status) && `(${i.status.replace(/_/g, ' ').toLowerCase()})`}
              </span>,
        value: i.computeStackId,
        hasAuth: instanceAuths[i.computeStackId],
        isUnavailable: ['CREATE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK'].includes(i.status)
      })),
      activeOption: {
        label: <span>
              <i className={`d-none d-sm-inline-block fa me-2 fa-${!selectedInstance ? '' : selectedInstance?.isLocal ? 'server' : 'cloud'}`} />
              {selectedInstance?.instanceName}
            </span>,
        value: computeStackId
      }
    };
  }, [computeStackId]);
  const linkPrefix = `/o/${customerId}/i/${computeStackId}`;
  const linkRoute = location.pathname.split(`/i/${computeStackId}`)[1].split('/')[1];
  const currentRoute = routes?.find(r => r.link === linkRoute);
  const navigateFn = ({
    value,
    hasAuth,
    isUnavailable
  }) => {
    if (isUnavailable) {
      return false;
    }
    if (hasAuth) {
      return navigate(`/o/${customerId}/i/${value}/${currentRoute?.link}`);
    }
    return navigate(`/o/${customerId}/instances/login`);
  };
  return <ErrorBoundary onError={(error, componentStack) => addError({
    error: {
      message: error.message,
      componentStack
    }
  })} FallbackComponent={ErrorFallback}>
      <Navbar className="app-subnav">
        {!config.isLocalStudio && <Nav navbar className="instance-select">
            <SelectDropdown className="react-select-container" classNamePrefix="react-select" onChange={navigateFn} options={options || []} value={activeOption} defaultValue={activeOption.value} isSearchable={false} isClearable={false} isLoading={!options} noOptionsMessage={() => 'No other instances available'} />
          </Nav>}
        <Nav navbar className="instance-nav d-none d-lg-flex">
          {routes?.map(route => <NavItem key={route.path}>
              <NavLink title={route.link} className="nav-link" to={`${linkPrefix}/${route.link === 'browse' && defaultBrowseURL ? `${route.link}/${defaultBrowseURL}` : route.link}`}>
                <i className={`d-none d-sm-inline-block fa me-2 fa-${route.icon}`} />
                {route.label || route.link}
                {!!alarms && route.link === 'status' && <span className="badge">{alarms}</span>}
              </NavLink>
            </NavItem>)}
        </Nav>
        <Nav navbar className="instance-nav-select d-flex d-lg-none">
          <SelectDropdown className="react-select-container" classNamePrefix="react-select" width="200px" onChange={({
          value
        }) => navigate(`${linkPrefix}/${value}`)} options={routes?.map(route => ({
          label: <span>
                  <i className={`d-none d-sm-inline-block fa me-2 fa-${route.icon}`} />
                  {route.label}
                </span>,
          value: route.link
        }))} isLoading={!currentRoute?.link} value={{
          label: <span>
                  <i className={`d-none d-sm-inline-block fa me-2 fa-${currentRoute?.icon}`} />
                  {currentRoute?.label}
                </span>,
          value: currentRoute?.link
        }} defaultValue={currentRoute?.link} isSearchable={false} isClearable={false} />
        </Nav>
      </Navbar>
    </ErrorBoundary>;
}
export default Subnav;