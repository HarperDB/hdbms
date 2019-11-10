import React, { useState } from 'react';
import createPersistedState from 'use-persisted-state';
import useAsyncEffect from 'use-async-effect';

import updateInstanceStates from '../util/updateInstanceStates';
import generateActiveInstanceStructure from '../util/generateActiveInstanceStructure';
import getInstancesNetworkStatuses from '../util/getInstancesNetworkStatuses';

const useInstanceState = createPersistedState('instances');
export const HarperDBContext = React.createContext();

export const HarperDBProvider = ({ children }) => {
  const [instances, setInstances] = useInstanceState([]);
  const [structure, setStructure] = useState(false);
  const [authError, setAuthError] = useState(false);

  const queryHarperDB = async (operation, authObject = false) => {
    const { url, auth } = authObject || instances.find((i) => i.active);
    const body = JSON.stringify(operation);
    try {
      const response = await fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json', authorization: `Basic ${auth}` } });
      return response.json();
    } catch {
      return { error: 'Could not connect. Is HarperDB running?' };
    }
  };

  const login = async (authObject) => {
    const dbResponse = await queryHarperDB({ operation: 'describe_all' }, authObject);

    if (dbResponse.error) {
      setAuthError(dbResponse.error);
      return false;
    }

    setInstances(updateInstanceStates(instances, authObject));
    return setStructure(generateActiveInstanceStructure(dbResponse));
  };

  const logout = () => {
    setStructure(false);
    setInstances(instances.map((i) => { i.active = false; return i; }));
  };

  const refreshNetwork = async () => setInstances(await getInstancesNetworkStatuses(instances, queryHarperDB));

  const refreshInstance = async () => {
    const dbResponse = await queryHarperDB({ operation: 'describe_all' });
    setStructure(generateActiveInstanceStructure(dbResponse));
  };

  useAsyncEffect(async () => {
    const activeInstance = instances.find((i) => i.active);
    if (activeInstance) login(activeInstance);
    refreshNetwork();
  }, []);

  return (
    <HarperDBContext.Provider value={{ authError, setAuthError, structure, instances, refreshInstance, refreshNetwork, login, logout, queryHarperDB }}>
      {children}
    </HarperDBContext.Provider>
  );
};
