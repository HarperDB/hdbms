import React, { useState, useEffect } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button } from '@nio/ui-kit';
import { useParams } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import useAsyncEffect from 'use-async-effect';

import alterRole from '../../../api/instance/alterRole';
import instanceState from '../../../state/instanceState';
import usePersistedUser from '../../../state/persistedUser';
import buildPermissionStructure from '../../../methods/instance/buildPermissionStructure';

export default () => {
  const [{ darkTheme }] = usePersistedUser({});
  const alert = useAlert();
  const { role_id } = useParams();
  const roles = useStoreState(instanceState, (s) => s.roles);
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const [newPermissions, setNewPermissions] = useState({});
  const [activePermissions, setActivePermissions] = useState({});
  const [loading, setLoading] = useState(false);

  useAsyncEffect(async () => {
    if (role_id && roles) {
      const defaultActivePermissions = await buildPermissionStructure({ auth, url, currentRolePermissions: roles.find((r) => r.id === role_id).permission });
      setActivePermissions(defaultActivePermissions);
      setNewPermissions(defaultActivePermissions);
    }
  }, [role_id, roles]);

  const submitRecord = async (e) => {
    e.preventDefault();

    if (!newPermissions) {
      alert.error('Please insert valid JSON to proceed');
      return false;
    }

    setLoading(true);
    const response = await alterRole({ permission: newPermissions, id: role_id, auth, url });
    setLoading(false);

    if (response.error) {
      alert.error(`${response.message} Permissions reset.`);
      setNewPermissions(activePermissions);
    } else if (response.skipped_hashes.length) {
      alert.error('Invalid role id. Permissions reset.');
      setNewPermissions(activePermissions);
    } else {
      alert.success('Permissions updated successfully');
    }
    return instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
  };

  return (
    <>
      <JSONInput
        placeholder={newPermissions}
        height="calc(100vh - 340px)"
        theme="light_mitsuketa_tribute"
        colors={{
          background: 'transparent',
          default: darkTheme ? '#aaa' : '#000',
          colon: darkTheme ? '#aaa' : '#000',
          keys: darkTheme ? '#aaa' : '#000',
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
      <Button block color="success" disabled={loading} onClick={submitRecord}>
        {loading ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Update Role Permissions</span>}
      </Button>
    </>
  );
};
