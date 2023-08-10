import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';
import { useStoreState } from 'pullstate';
import { useParams, useNavigate } from 'react-router-dom';
import useInterval from 'use-interval';

import instanceState from '../../../../functions/state/instanceState';

import WebIDE from '../../../shared/webide/WebIDE';
import Deploy from './Deploy';
import EmptyPrompt from '../../../shared/EmptyPrompt';
import ErrorFallback from '../../../shared/ErrorFallback';
import addError from '../../../../functions/api/lms/addError';
import CopyableText from '../../../shared/CopyableText';

function ManageIndex({ refreshCustomFunctions, loading }) {
  const custom_functions = useStoreState(instanceState, (s) => s.custom_functions);
  const { fileTree } = custom_functions;
  const registration = useStoreState(instanceState, (s) => s.registration);
  const [majorVersion, minorVersion] = (registration?.version || '').split('.');
  const supportsStaticRoutes = parseFloat(`${majorVersion}.${minorVersion}`) < 4.1;
  const restarting = useStoreState(instanceState, (s) => s.restarting_service === 'custom_functions');
  const url = useStoreState(instanceState, (s) => s.url);

  const waitForRestartToComplete = async () => {
    if (url && restarting) {
      try {
        await fetch(url);
        instanceState.update((s) => {
          s.restarting_service = false;
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  }

  useInterval(waitForRestartToComplete, 1000);

  /*
   *
   *
    turn this into 3 view system.
    menu: editor view, deploy view (table), reload button 
   */
  return (
    <Row id="functions">
      <Col>
        <WebIDE
          fileTree={fileTree}
          onSelect={() => {
            console.log('userland on select!') 
          }}
        />
      </Col>
    </Row>
  );
}

export default ManageIndex;
