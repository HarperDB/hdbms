import React, { useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button, Card, CardBody, Col, Form, Row } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';
import useAsyncEffect from 'use-async-effect';

import queryInstance from '../../../util/queryInstance';

export default ({ newEntityColumns, hashAttribute, instance_id, refreshInstance, auth }) => {
  const history = useHistory();
  const { schema, table, hash, action } = useParams();
  const [rowValue, setRowValue] = useState({});

  useAsyncEffect(async () => {
    if (action === 'edit') {
      const rowData = await queryInstance({
        operation: 'search_by_hash',
        schema,
        table,
        hash_values: [hash],
        get_attributes: ['*'],
      }, auth);
      setRowValue(rowData[0]);
    } else {
      setRowValue(newEntityColumns);
    }
  }, [hash]);

  const submitRecord = async (e) => {
    e.preventDefault();
    if (!action) return false;

    await queryInstance({
      operation: action === 'edit' ? 'update' : 'insert',
      schema,
      table,
      records: [rowValue],
    }, auth);
    refreshInstance(Date.now());
    return history.push(`/instances/${instance_id}/browse/${schema}/${table}`);
  };

  const deleteRecord = async (e) => {
    e.preventDefault();
    if (!action) return false;

    await queryInstance({
      operation: 'delete',
      schema,
      table,
      hash_values: [hash],
    }, auth);
    refreshInstance(Date.now());
    return history.push(`/instances/${instance_id}/browse/${schema}/${table}`);
  };

  return (
    <>
      <span className="text-bold text-white mb-2">{schema} {table && '>'} {table} {action === 'add' ? '> add new' : hash ? `> ${hash}` : ''}&nbsp;</span>
      <Card className="my-3">
        <CardBody>
          <Form onSubmit={submitRecord}>
            { action === 'add' && (
              <>
                <small className="text-center">Note: The hash_attribute for this table is &quot;<b>{hashAttribute}</b>&quot;, and will auto-generate. You may manually add it if you want to specify its value.</small>
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
              <Col className="mb-2">
                <Button block color="black" onClick={() => history.push(`/instances/${instance_id}/browse/${schema}/${table}`)}>Cancel</Button>
              </Col>
              {action !== 'add' && (
                <Col className="mb-2">
                  <Button block color="danger" onClick={deleteRecord}>Delete</Button>
                </Col>
              )}
              <Col>
                <Button block color="success">{action === 'edit' ? 'Update' : 'Add New' }</Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </>
  );
};
