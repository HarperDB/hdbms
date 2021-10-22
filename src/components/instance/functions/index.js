import React, { useState, useEffect, useCallback } from 'react';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';

import instanceState from '../../../functions/state/instanceState';

import Setup from './setup';
import Manage from './manage';
import ComingSoon from './comingsoon';
import Loader from '../../shared/Loader';
import buildCustomFunctions from '../../../functions/instance/buildCustomFunctions';
import EmptyPrompt from '../../shared/EmptyPrompt';
import getCustomFunction from '../../../functions/api/instance/getCustomFunction';

const CustomFunctionsIndex = () => {
  const { project, type, file } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const custom_functions = useStoreState(instanceState, (s) => s.custom_functions);
  const restarting = useStoreState(instanceState, (s) => s.restarting);
  const [showManage, setShowManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState(false);
  const [code, setCode] = useState();

  const setEditorToFile = useCallback(async () => {
    if (project && type && file && file !== 'undefined') {
      const endpoint_code = await getCustomFunction({ auth, url, project, type, file });
      setCode(endpoint_code?.message);
    } else {
      setCode(false);
    }
  }, [auth, url, project, type, file, setCode]);

  const refreshCustomFunctions = useCallback(async () => {
    if (auth && url && !restarting) {
      setLoading(true);
      await buildCustomFunctions({ auth, url });
      await setEditorToFile();
      setLoading(false);
    }
  }, [auth, url, restarting]);

  useEffect(refreshCustomFunctions, [refreshCustomFunctions]);

  useEffect(() => {
    const isConfigured = custom_functions?.is_enabled && custom_functions?.port;
    setShowManage(isConfigured);
    if (isConfigured) {
      setConfiguring(false);
    }
  }, [custom_functions]);

  useInterval(() => {
    if (configuring) refreshCustomFunctions();
  }, 2000);

  return !custom_functions ? (
    <Loader header="loading custom functions" spinner />
  ) : custom_functions.error ? (
    <ComingSoon />
  ) : configuring ? (
    <EmptyPrompt description="Configuring Custom Functions" icon={<i className="fa fa-spinner fa-spin" />} />
  ) : showManage ? (
    <Manage refreshCustomFunctions={refreshCustomFunctions} loading={loading} setEditorToFile={setEditorToFile} code={code} setCode={setCode} />
  ) : (
    <Setup setConfiguring={setConfiguring} />
  );
};

export default CustomFunctionsIndex;
