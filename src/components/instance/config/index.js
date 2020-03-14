import React from 'react';
import { useStoreState } from 'pullstate';

import UpdateInstanceForm from './updateInstanceForm';
import instanceState from '../../../state/stores/instanceState';

export default () => {
  const computeProducts = useStoreState(instanceState, (s) => s.computeProducts);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">resize instance</span>
      {computeProducts ? (
        <UpdateInstanceForm />
      ) : (
        <i className="fa fa-spinner fa-spin text-white" />
      )}
    </>
  );
};
