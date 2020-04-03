import React, { useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button, Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory, useParams } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import queryInstance from '../../../api/queryInstance';
import instanceState from '../../../state/stores/instanceState';

export default ({ newEntityColumns, hashAttribute }) => {
  const alert = useAlert();
  const history = useHistory();
  const { schema, table, hash, action } = useParams();
  const { compute_stack_id, auth, url } = useStoreState(instanceState, (s) => ({
    compute_stack_id: s.compute_stack_id,
    auth: s.auth,
    url: s.url,
  }));
  const [rowValue, setRowValue] = useState({});

  useAsyncEffect(async () => {
    if (action === 'edit') {
      const [rowData] = await queryInstance(
        {
          operation: 'search_by_hash',
          schema,
          table,
          hash_values: [hash],
          get_attributes: ['*'],
        },
        auth,
        url
      );
      // eslint-disable-next-line no-underscore-dangle
      delete rowData.__createdtime__;
      // eslint-disable-next-line no-underscore-dangle
      delete rowData.__updatedtime__;
      setRowValue(rowData);
    } else {
      setRowValue(newEntityColumns);
    }
  }, [hash]);

  const submitRecord = async (e) => {
    e.preventDefault();
    if (!action) {
      return false;
    }
    if (!rowValue) {
      alert.error('Please insert valid JSON to proceed');
      return false;
    }

    await queryInstance(
      {
        operation: action === 'edit' ? 'update' : 'insert',
        schema,
        table,
        records: [rowValue],
      },
      auth,
      url
    );
    instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
    return history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}`);
  };

  const deleteRecord = async (e) => {
    e.preventDefault();
    if (!action) return false;

    await queryInstance(
      {
        operation: 'delete',
        schema,
        table,
        hash_values: [hash],
      },
      auth,
      url
    );
    instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
    return history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}`);
  };

  console.log(rowValue);

  return (
    <>
      <span className="text-white mb-2 floating-card-header">
        {schema} {table && '>'} {table} {action === 'add' ? '> add new' : hash ? `> ${hash}` : ''}
        &nbsp;
      </span>
      <Card className="my-3">
        <CardBody>
          <ul className="text-small">
            <li>
              The auto-maintained fields &quot;<b>__createdtime__</b>&quot; &amp; &quot;<b>__updatedtime__</b>&quot; have been hidden from this view.
            </li>
            {action === 'add' && (
              <li>
                The hash_attribute for this table is &quot;<b>{hashAttribute}</b>&quot;, and will auto-generate. You may manually add it if you want to specify its value.
              </li>
            )}
          </ul>
          <Card className="mb-1">
            <CardBody className="json-editor-holder">
              <JSONInput
                placeholder={rowValue}
                height="350px"
                theme="light_mitsuketa_tribute"
                colors={{
                  background: 'transparent',
                  default: '#000',
                  colon: '#000',
                  keys: '#480b8a',
                  string: '#0280c4',
                  number: '#ea4c89',
                  primitive: '#312556',
                }}
                locale={locale}
                width="100%"
                waitAfterKeyPress={1000}
                confirmGood={false}
                onChange={(value) => setRowValue(value.jsObject)}
              />
            </CardBody>
          </Card>
          <Row>
            <Col className="mt-2">
              <Button block color="black" onClick={() => history.push(`/instance/${compute_stack_id}/browse/${schema}/${table}`)}>
                Cancel
              </Button>
            </Col>
            {action !== 'add' && (
              <Col className="mt-2">
                <Button block color="danger" onClick={deleteRecord}>
                  Delete
                </Button>
              </Col>
            )}
            <Col>
              <Button className="mt-2" onClick={submitRecord} block color="success">
                {action === 'edit' ? 'Update' : 'Add New'}
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};
