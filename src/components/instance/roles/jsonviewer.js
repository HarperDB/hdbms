import React, { useState, useEffect } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button } from '@nio/ui-kit';
import { useParams } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import alterRole from '../../../api/instance/alterRole';
import instanceState from '../../../state/instanceState';
import themeState from '../../../state/themeState';

export default () => {
  const [darkTheme] = themeState(false);
  const alert = useAlert();
  const { role_id } = useParams();
  const { permissions, roles, auth, url } = useStoreState(instanceState, (s) => ({
    permissions: s.permissions,
    roles: s.roles,
    auth: s.auth,
    url: s.url,
  }));
  const [newPermissions, setNewPermissions] = useState({});
  const [activePermissions, setActivePermissions] = useState({});

  useEffect(() => {
    if (role_id && roles) {
      setActivePermissions(roles.find((r) => r.id === role_id).permission);
    }
  }, [role_id, roles]);

  useEffect(() => {
    if (activePermissions) {
      setNewPermissions({ ...permissions, ...activePermissions });
    }
  }, [activePermissions]);

  const submitRecord = async (e) => {
    e.preventDefault();

    if (!newPermissions) {
      alert.error('Please insert valid JSON to proceed');
      return false;
    }

    const response = await alterRole({ permission: newPermissions, id: role_id, auth, url });
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
      <Button block color="success" onClick={submitRecord}>
        Update Role Permissions
      </Button>
    </>
  );
};
