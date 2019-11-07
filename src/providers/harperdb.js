import React, { useState } from 'react';
import createPersistedState from 'use-persisted-state';
import useAsyncEffect from 'use-async-effect';

import handleCellValues from '../util/handleCellValues';

const useConnectionState = createPersistedState('connection');
export const HarperDBContext = React.createContext();

export const HarperDBProvider = ({ children }) => {
  const [Authorization, setAuthorization] = useConnectionState(false);
  const [structure, setStructure] = useState(false);
  const [lastUpdate, updateDB] = useState(false);
  const [authError, setAuthError] = useState(false);

  const queryHarperDB = async (operation) => {
    const { protocol, hostname } = window.location;
    const url = `${protocol}//${hostname}:9925`;
    const body = JSON.stringify(operation);
    const response = await fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json', Authorization: `Basic ${Authorization}` } });
    return response.json();
  };

  const queryTableData = async ({ schema, table, pageSize, page, filtered, sorted }) => {
    let countSQL = `SELECT count(*) FROM ${schema}.${table} `;
    if (filtered.length) countSQL += `WHERE ${filtered.map((f) => ` ${f.id} LIKE '%${f.value}%'`).join(' AND ')} `;

    const recordCountResult = await queryHarperDB({ operation: 'sql', sql: countSQL });
    const newTotalRecords = recordCountResult && recordCountResult[0] && recordCountResult[0]['COUNT(*)']
    const newTotalPages = newTotalRecords && Math.ceil(newTotalRecords / pageSize);

    let sql = `SELECT * FROM ${schema}.${table} `;
    if (filtered.length) sql += `WHERE ${filtered.map((f) => ` ${f.id} LIKE '%${f.value}%'`).join(' AND ')} `;
    if (sorted.length) sql += `ORDER BY ${sorted[0].id} ${sorted[0].desc ? 'DESC' : 'ASC'}`;
    sql += ` LIMIT ${(page * pageSize) + pageSize} OFFSET ${page * pageSize}`;

    const newData = await queryHarperDB({ operation: 'sql', sql });

    return { newData, newTotalPages, newTotalRecords };
  };

  useAsyncEffect(async () => {
    setAuthError(false);
    if (!Authorization) {
      setStructure(false);
      return false;
    }

    const dbStructure = {};
    const dbResponse = await queryHarperDB({ operation: 'describe_all' });

    if (dbResponse.error) {
      setAuthorization(false);
      setAuthError(dbResponse.error);
      return false;
    }

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
    <HarperDBContext.Provider value={{ setAuthorization, authError, structure, updateDB, queryHarperDB, queryTableData }}>
      {children}
    </HarperDBContext.Provider>
  );
};
