import React, { useCallback } from 'react';

import useInstanceAuth from '../../../state/instanceAuths';

const CardFrontIcons = ({ showRemove, showSpinner, showError, showLogout, setFlipState, compute_stack_id }) => {
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  const logOut = useCallback((e) => {
    e.stopPropagation();
    setInstanceAuths({
      ...instanceAuths,
      [compute_stack_id]: false,
    });
  }, []);

  const flipToDelete = useCallback((e) => {
    e.stopPropagation();
    setFlipState('delete');
  }, []);

  return (
    <>
      {showRemove && <i title="Remove Instance" className="fa fa-trash rm-1 delete text-purple" onClick={flipToDelete} />}
      {showSpinner ? (
        <i className="fa fa-spinner fa-spin text-purple" />
      ) : showError ? (
        <i className="fa fa-exclamation-triangle text-danger" />
      ) : showLogout ? (
        <i onClick={logOut} title="Remove Instance Authentication" className="fa fa-lock text-purple" />
      ) : (
        <i title="Instance Requires Authentication" className="fa fa-unlock-alt text-danger" />
      )}
    </>
  );
};

export default CardFrontIcons;
