import React, { useState, useEffect } from 'react';
import createPersistedState from 'use-persisted-state';

import queryHarperDB from '../util/queryHarperDB';
import processDBResponse from '../util/processDBResponse';

const useConnectionState = createPersistedState('connection');

export const HarperDBContext = React.createContext();

export const HarperDBProvider = ({ children }) => {
  const [db, setDB] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdate, refreshDB] = useState(false);
  const [connection, setConnection] = useConnectionState(false);

  useEffect(() => {
    const getDBConfig = async () => {
      let dbResponse = false;

      try {
        dbResponse = await queryHarperDB(connection, { operation: 'describe_all' });

        if (!dbResponse.error) {
          const dbStructure = processDBResponse(dbResponse);
          setDB(dbStructure);
        } else {
          setError(dbResponse.error);
        }
      } catch (e) {
        setError(e.error);
      }
    };

    if (connection) {
      getDBConfig();
    } else {
      setDB(false);
    }
  }, [connection, lastUpdate]);

  return (
    <HarperDBContext.Provider value={{ db, error, connection, setConnection, refreshDB }}>
      {children}
    </HarperDBContext.Provider>
  );
};
