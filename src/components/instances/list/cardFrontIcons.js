import React, { useCallback } from 'react';

import useInstanceAuth from '../../../state/instanceAuths';

const CardFrontIcons = ({ isReady, showLogout, setFlipState, compute_stack_id, instance_name, isOrgOwner }) => {
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  const logOut = useCallback((e) => {
    e.stopPropagation();
    setInstanceAuths({ ...instanceAuths, [compute_stack_id]: false });
  }, []);

  const flipToDelete = useCallback((e) => {
    e.stopPropagation();
    setFlipState('delete');
  }, []);

  return (
    <>
      {isReady && isOrgOwner && <i title={`Remove instance ${instance_name}`} className="fa fa-trash delete text-purple" onClick={flipToDelete} />}
      {!isReady ? (
        <i className="fa fa-spinner fa-spin text-purple" />
      ) : showLogout ? (
        <i onClick={logOut} title={`Log out of instance ${instance_name}`} className="fa fa-lock text-purple" />
      ) : (
        <i className="fa fa-unlock-alt text-danger" />
      )}
    </>
  );
};

export default CardFrontIcons;
