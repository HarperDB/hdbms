import React from 'react';
import { useStoreState } from 'pullstate';

import UpdateInstanceForm from './updateInstanceForm';
import instanceState from '../../../state/stores/instanceState';

export default ({ auth, details, refreshInstance }) => {
  const { computeProducts, storageProducts } = useStoreState(instanceState, (s) => ({
    computeProducts: s.computeProducts,
    storageProducts: s.storageProducts,
  }));

  return (
    <>
      <span className="text-white mb-2 floating-card-header">resize instance</span>
      {computeProducts ? (
        <UpdateInstanceForm
          instanceAuth={auth}
          details={details}
          refreshInstance={refreshInstance}
          computeProducts={computeProducts}
          storageProducts={storageProducts}
        />
      ) : (
        <i className="fa fa-spinner fa-spin text-white" />
      )}
    </>
  );
};
