import React, { useState, useEffect, useContext } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button, Col, Form, Loader, Row } from '@nio/ui-kit';
import { withRouter } from 'react-router-dom';

import { HarperDBContext } from '../../providers/harperdb';
import queryHarperDB from '../../util/queryHarperDB';

export default withRouter(({ history, activeSchema, activeTable, activeHash, hashAttribute, action, columns }) => {
  const { connection, refreshDB } = useContext(HarperDBContext);

  const [rowValue, setRowValue] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const operation = {
        operation: 'sql',
        sql: `SELECT * FROM ${activeSchema}.${activeTable} WHERE ${hashAttribute} = '${activeHash}'`
      };
      const rowData = await queryHarperDB(connection, operation);
      const thisRow = rowData[0];

      const orderedObject = { [hashAttribute]: thisRow[hashAttribute] };
      Object.keys(columns).map((c) => orderedObject[c] = thisRow[c]);

      setRowValue(orderedObject);
    };
    if (action === 'edit') {
      fetchData();
    } else {
      setRowValue(columns);
    }
  }, [activeSchema, activeTable, activeHash, hashAttribute, action]);

  const submitRecord = async (e) => {
    e.preventDefault();
    if (!action) return false;

    const operation = {
      operation: action === 'edit' ? 'update' : 'insert',
      schema: activeSchema,
      table: activeTable,
      records: [rowValue],
    };

    await queryHarperDB(connection, operation);
    refreshDB(new Date());
    history.push(`/browse/${activeSchema}/${activeTable}`);
  };

  return (
    <Form onSubmit={submitRecord}>
      { action === 'add' && (
        <>
          <span>Note: The hash_attribute for this table is "<b>{hashAttribute}</b>", and will auto-generate. You may manually add it if you want to specify its value.</span>
          <hr />
        </>
      )}
      <JSONInput
        placeholder={rowValue}
        height="350px"
        theme="light_mitsuketa_tribute"
        colors={{ background: 'rgba(255, 255, 255, 0.3)', default: '#000', colon: '#000', keys: '#480b8a', string: '#0280c4', number: '#ea4c89', primitive: '#312556' }}
        locale={locale}
        width="100%"
        waitAfterKeyPress={5000}
        onChange={(value) => setRowValue(value.jsObject)}
      />
      <hr />
      <Row>
        <Col sm="6" className="mb-2">
          <Button block color="purple" outline onClick={() => history.push(`/browse/${activeSchema}/${activeTable}`)}>Cancel</Button>
        </Col>
        <Col sm="6">
          <Button block color="purple">{action === 'edit' ? 'Update' : 'Add New' }</Button>
        </Col>
      </Row>
    </Form>
  );
});
