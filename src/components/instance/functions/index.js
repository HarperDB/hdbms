import React, { useState, useEffect, useCallback } from 'react';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import instanceState from '../../../functions/state/instanceState';
import Setup from './setup';
import Manage from './manage';
import ComingSoon from './comingsoon';
import Loader from '../../shared/Loader';
import buildCustomFunctions from '../../../functions/instance/functions/buildCustomFunctions';
import EmptyPrompt from '../../shared/EmptyPrompt';
function CustomFunctionsIndex() {
  const auth = useStoreState(instanceState, s => s.auth);
  const url = useStoreState(instanceState, s => s.url);
  const customFunctions = useStoreState(instanceState, s => s.customFunctions);
  const registration = useStoreState(instanceState, s => s.registration);
  const [majorVersion, minorVersion] = (registration?.version || '').split('.') || [];
  const supportsApplicationsAPI = parseFloat(`${majorVersion}.${minorVersion}`) >= 4.2;
  const restarting = useStoreState(instanceState, s => s.restarting);
  const [showManage, setShowManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState(false);
  const refreshCustomFunctions = useCallback(async () => {
    if (auth && url && !restarting) {
      setLoading(true);
      await buildCustomFunctions({
        auth,
        url
      });
      setLoading(false);
    }
  }, [auth, url, restarting]);
  useEffect(() => {
    refreshCustomFunctions();
  }, [refreshCustomFunctions]);
  useEffect(() => {
    const isConfigured = customFunctions?.isEnabled && customFunctions?.port || supportsApplicationsAPI;
    setShowManage(isConfigured);
    if (isConfigured) {
      setConfiguring(false);
    }
  }, [customFunctions, supportsApplicationsAPI]);
  useInterval(() => {
    if (configuring) refreshCustomFunctions();
  }, 2000);
  return !customFunctions ? <Loader header="loading custom functions" spinner /> : customFunctions.error ? <ComingSoon /> : configuring ? <EmptyPrompt description="Configuring Custom Functions" icon={<i className="fa fa-spinner fa-spin" />} /> : showManage ? <Manage refreshCustomFunctions={refreshCustomFunctions} loading={loading} /> : <Setup setConfiguring={setConfiguring} />;
}
export default CustomFunctionsIndex;