import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';
import { useStoreState } from 'pullstate';
import { useParams, useNavigate } from 'react-router-dom';
import useInterval from 'use-interval';

import instanceState from '../../../../functions/state/instanceState';

import EntityManager from './EntityManager';
import CodeEditor from './CodeEditor';
import FileBrowser from './FileBrowser';
import Deploy from './Deploy';
import EmptyPrompt from '../../../shared/EmptyPrompt';
import ErrorFallback from '../../../shared/ErrorFallback';
import addError from '../../../../functions/api/lms/addError';
import EntityReloader from './EntityReloader';
import StaticEntityStatus from './StaticEntityStatus';
import CopyableText from '../../../shared/CopyableText';

function ManageIndex({ componentFiles, refreshCustomFunctions, loading }) {
  const { customer_id, compute_stack_id, action = 'edit', project, file } = useParams();
  const navigate = useNavigate();
  const custom_functions = useStoreState(instanceState, (s) => s.custom_functions);
  const registration = useStoreState(instanceState, (s) => s.registration);
  const [majorVersion, minorVersion] = (registration?.version || '').split('.');
  const supportsStaticRoutes = parseFloat(`${majorVersion}.${minorVersion}`) < 4.1;
  const restarting = useStoreState(instanceState, (s) => s.restarting_service === 'custom_functions');
  // NOTE: use the operationsApi server for cf_server_url in the future.
  const cf_server_url = useStoreState(instanceState, (s) => s.custom_functions_url || `${s.url.split(':').slice(0, -1).join(':')}:${s.custom_functions?.port}`);
  const baseUrl = `/o/${customer_id}/i/${compute_stack_id}/functions/${action}`;

  const routeToDefaultProject = () => {

    const hasProjects = custom_functions?.endpoints && Object.keys(custom_functions?.endpoints).length;
    const projectIsInEndpoints = custom_functions?.endpoints && Object.keys(custom_functions?.endpoints).includes(project);

    let targetUrl;

    if (hasProjects && project && !projectIsInEndpoints) {

      const firstProject = project && Object.keys(custom_functions?.endpoints)[0];
      targetUrl = `${baseUrl}/${firstProject}`;

    } else if (hasProjects && project && !file) {

      const firstRouteFile = project && custom_functions?.endpoints[project]?.routes[0];
      const firstHelperFile = project && custom_functions?.endpoints[project]?.helpers[0];
      const defaultType = firstRouteFile ? 'routes' : 'helpers';
      targetUrl = `${baseUrl}/${project}/${defaultType}/${firstRouteFile || firstHelperFile}`;

    } else if (hasProjects && !project) {

      const firstProject = Object.keys(custom_functions?.endpoints)[0];
      targetUrl = `${baseUrl}/${firstProject}`;

    } else if (!hasProjects) {

      targetUrl = baseUrl;
    }

    navigate(targetUrl);
  }

  const waitForRestartToComplete = async () => {
    if (cf_server_url && restarting) {
      try {
        await fetch(cf_server_url);
        instanceState.update((s) => {
          s.restarting_service = false;
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  }

  useEffect(routeToDefaultProject, [custom_functions?.endpoints, customer_id, compute_stack_id, navigate, action, project, file, baseUrl]);
  useInterval(waitForRestartToComplete, 1000);

  return (
    <Row id="functions">
      <Col xl="3" lg="4" md="6" xs="12">
        <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
          <FileBrowser
            files={componentFiles}
            onSelect={(dirEntry) => { console.log('file info:', dirEntry)}  }/>
        </ErrorBoundary>
      </Col>
      <Col xl="9" lg="8" md="6" xs="12">
        {action === 'deploy' ? (
          <Deploy />
        ) : project ? (
          <CodeEditor />
        ) : (
          <EmptyPrompt refreshCustomFunctions={refreshCustomFunctions} headline={`Please ${custom_functions?.endpoints.length ? 'choose' : 'create'} a project at left.`} />
        )}
      </Col>
    </Row>
  );
}

export default ManageIndex;
