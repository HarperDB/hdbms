import React from 'react';

import UpdateInstanceForm from './updateInstanceForm';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';

export default ({ auth, details, refreshInstance }) => {
  const [{ products }] = useApp(defaultAppData);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">resize instance</span>
      {products && details ? (
        <UpdateInstanceForm
          instanceAuth={auth}
          details={details}
          refreshInstance={refreshInstance}
          computeProducts={details.is_local ? products.localCompute : products.cloudCompute}
          storageProducts={details.is_local ? false : products.cloudStorage}
        />
      ) : (
        <i className="fa fa-spinner fa-spin text-white" />
      )}
    </>
  );
}
