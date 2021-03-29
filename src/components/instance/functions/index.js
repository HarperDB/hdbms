import React, { useState, useEffect, useCallback } from 'react';
import { useStoreState } from 'pullstate';

import instanceState from '../../../functions/state/instanceState';

import Setup from './setup';
import Manage from './manage';
import ComingSoon from './comingsoon';
import Loader from '../../shared/Loader';
import buildCustomFunctions from '../../../functions/instance/buildCustomFunctions';

const ClusteringIndex = () => {
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const custom_functions = useStoreState(instanceState, (s) => s.custom_functions);
  const restarting = useStoreState(instanceState, (s) => s.restarting);
  const [showManage, setShowManage] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshCustomFunctions = useCallback(async () => {
    if (auth && url && !restarting) {
      setLoading(true);
      await buildCustomFunctions({ auth, url });
      setLoading(false);
    }
  }, [auth, url, restarting]);

  useEffect(refreshCustomFunctions, [refreshCustomFunctions]);

  useEffect(() => {
    if (custom_functions) {
      setShowManage(!!custom_functions.is_enabled && !!custom_functions.port);
    }
  }, [custom_functions]);

  return !custom_functions ? (
    <Loader header="loading custom functions" spinner />
  ) : custom_functions.error ? (
    <ComingSoon />
  ) : showManage ? (
    <Manage refreshCustomFunctions={refreshCustomFunctions} restarting={restarting} />
  ) : (
    <Setup refreshCustomFunctions={refreshCustomFunctions} restarting={restarting} />
  );
};

export default ClusteringIndex;
