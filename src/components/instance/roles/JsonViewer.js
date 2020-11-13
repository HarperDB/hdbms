import React, { useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button } from 'reactstrap';
import { useParams } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../functions/state/appState';
import instanceState from '../../../functions/state/instanceState';

import alterRole from '../../../functions/api/instance/alterRole';
import buildPermissionStructure from '../../../functions/instance/buildPermissionStructure';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';

const JsonViewer = ({ showAttributes }) => {
  const alert = useAlert();
  const { compute_stack_id, customer_id, role_id } = useParams();
  const roles = useStoreState(instanceState, (s) => s.roles);
  const version = useStoreState(instanceState, (s) => s.registration?.version);
  const lastUpdate = useStoreState(instanceState, (s) => s.lastUpdate);
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const theme = useStoreState(appState, (s) => s.theme);
  const [newPermissions, setNewPermissions] = useState({});
  const [activePermissions, setActivePermissions] = useState({});
  const [loading, setLoading] = useState(false);

  useAsyncEffect(async () => {
    if (role_id && roles) {
      const defaultActivePermissions = await buildPermissionStructure({
        auth,
        url,
        version,
        currentRolePermissions: roles.find((r) => r.id === role_id).permission,
        is_local,
        compute_stack_id,
        customer_id,
        showAttributes,
      });
      setActivePermissions(defaultActivePermissions);
      setNewPermissions(defaultActivePermissions);
    }
  }, [role_id, roles, lastUpdate, showAttributes]);

  const submitRecord = async (e) => {
    e.preventDefault();

    if (!newPermissions) {
      alert.error('Please insert valid JSON to proceed');
      return false;
    }

    setLoading(true);
    const permission = { super_user: false, ...newPermissions };
    const response = await alterRole({ permission, id: role_id, auth, url, is_local, compute_stack_id, customer_id });
    setLoading(false);

    if (response.error) {
      alert.error(`${response.message} Permissions reset.`);
      setNewPermissions(activePermissions);
    } else {
      alert.success('Permissions updated successfully');
    }
    return instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
  };

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <JSONInput
        placeholder={newPermissions}
        height="calc(100vh - 340px)"
        theme="light_mitsuketa_tribute"
        colors={{
          background: 'transparent',
          default: theme === 'dark' ? '#aaa' : '#000',
          colon: theme === 'dark' ? '#aaa' : '#000',
          keys: theme === 'dark' ? '#aaa' : '#000',
          string: '#13c664',
          number: '#ea4c89',
          primitive: '#ffa500',
        }}
        locale={locale}
        width="100%"
        waitAfterKeyPress={1000}
        confirmGood={false}
        onChange={(value) => setNewPermissions(value.jsObject)}
      />
      <hr />
      <Button id="updateRolePermissions" block color="success" disabled={loading} onClick={submitRecord}>
        {loading ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Update Role Permissions</span>}
      </Button>
    </ErrorBoundary>
  );
};

export default JsonViewer;
