import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';
import { useStoreState } from 'pullstate';
import { useParams, useNavigate } from 'react-router-dom';

import instanceState from '../../../../functions/state/instanceState';

import {default as ApplicationsIDE} from '../../../shared/webide/WebIDE';
import CustomFunctionsEditor from './CustomFunctionsEditor';

function ManageIndex({ refreshCustomFunctions, loading }) {
  const registration = useStoreState(instanceState, (s) => s.registration);
  const { fileTree } = useStoreState(instanceState, (s) => s.custom_functions); 
  const [majorVersion, minorVersion] = (registration?.version || '').split('.');
  const supportsApplicationsAPI = parseFloat(`${majorVersion}.${minorVersion}`) >= 4.2;

  return supportsApplicationsAPI ?

    <ApplicationsIDE
      fileTree={fileTree}
      onUpdate={refreshCustomFunctions} /> :

    <CustomFunctionsEditor
      refreshCustomFunctions={refreshCustomFunctions}
      loading={loading} />

}

export default ManageIndex;
