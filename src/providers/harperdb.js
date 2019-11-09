import React, { useState } from 'react';
import createPersistedState from 'use-persisted-state';
import useAsyncEffect from 'use-async-effect';

import handleCellValues from '../util/handleCellValues';

const useConnectionState = createPersistedState('connection');
const useInstanceState = createPersistedState('instances');
export const HarperDBContext = React.createContext();

export const HarperDBProvider = ({ children }) => {
  const [Authorization, setAuthorization] = useConnectionState(false);
  const [instances, setInstances] = useInstanceState([]);
  const [structure, setStructure] = useState(false);
  const [lastUpdate, updateDB] = useState(false);
  const [authError, setAuthError] = useState(false);

  const queryHarperDB = async (operation) => {
    const { url, auth } = Authorization;
    const body = JSON.stringify(operation);
    try {
      const response = await fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` } });
      return response.json();
    } catch {
      return { error: 'Could not connect. Is HarperDB running?' };
    }
  };

  const queryTableData = async ({ schema, table, pageSize, page, filtered, sorted }) => {
    if (!sorted.length) return false;

    let newTotalPages = 1;
    let newTotalRecords = 0;
    let newData = [];

    try {
      let countSQL = `SELECT count(*) as newTotalRecords FROM ${schema}.${table} `;
      if (filtered.length) countSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      [{ newTotalRecords }] = await queryHarperDB({ operation: 'sql', sql: countSQL });
      newTotalPages = newTotalRecords && Math.ceil(newTotalRecords / pageSize);
    } catch (e) {
      console.log('Failed to get row count');
    }

    try {
      let dataSQL = `SELECT * FROM ${schema}.${table} `;
      if (filtered.length) dataSQL += `WHERE ${filtered.map((f) => ` \`${f.id}\` LIKE '%${f.value}%'`).join(' AND ')} `;
      if (sorted.length) dataSQL += `ORDER BY \`${sorted[0].id}\` ${sorted[0].desc ? 'DESC' : 'ASC'}`;
      dataSQL += ` LIMIT ${(page * pageSize) + pageSize} OFFSET ${page * pageSize}`;
      newData = await queryHarperDB({ operation: 'sql', sql: dataSQL });
    } catch (e) {
      console.log('Failed to get table data');
    }

    return { newData, newTotalPages, newTotalRecords };
  };

  useAsyncEffect(async () => {
    if (!Authorization) {
      setStructure(false);
      return false;
    }

    const dbStructure = {};
    const dbResponse = await queryHarperDB({ operation: 'describe_all' });

    if (dbResponse.error) {
      setAuthError(dbResponse.error);
      setAuthorization(false);
      return false;
    }

    setInstances(instances.map((i) => { i.active = false; return i; }));

    const existingAuthObjectIndex = instances.findIndex((i) => i.auth === Authorization.auth || i.url === Authorization.url);
    if (existingAuthObjectIndex !== -1) {
      instances.splice(existingAuthObjectIndex, 1);
    }
    setInstances([...instances, { ...Authorization, active: true }]);

    Object.keys(dbResponse).map((schema) => {
      dbStructure[schema] = {};
      return Object.keys(dbResponse[schema]).map((table) => {
        const thisTable = dbResponse[schema][table];
        const attributes = thisTable.attributes.filter((a) => a.attribute !== thisTable.hash_attribute).map((a) => a.attribute).sort();
        const orderedColumns = [thisTable.hash_attribute, ...attributes];

        dbStructure[schema][table] = {
          hashAttribute: thisTable.hash_attribute,
          newEntityColumns: {},
          dataTableColumns: orderedColumns.map((k) => ({
            Header: k.replace(/__/g, ''),
            accessor: k,
            Cell: (props) => handleCellValues(props.value),
          })),
        };

        // generate new entity columns
        return attributes.map((c) => dbStructure[schema][table].newEntityColumns[c] = null);
      });
    });

    return setStructure(dbStructure);
  }, [Authorization, lastUpdate]);

  return (
    <HarperDBContext.Provider value={{ setAuthorization, Authorization, authError, setAuthError, structure, updateDB, instances, queryHarperDB, queryTableData }}>
      {children}
    </HarperDBContext.Provider>
  );
};
