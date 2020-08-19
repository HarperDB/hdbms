import React, { useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { useHistory, useParams } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../state/instanceState';
import appState from '../../../state/appState';

import queryInstance from '../../../api/queryInstance';
import addError from '../../../api/lms/addError';
import ErrorFallback from '../../shared/errorFallback';

export default ({ newEntityAttributes, hashAttribute }) => {
  const { customer_id, schema, table, hash, action, compute_stack_id } = useParams();
  const alert = useAlert();
  const history = useHistory();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const theme = useStoreState(appState, (s) => s.theme);
  const [rowValue, setRowValue] = useState({});

  useAsyncEffect(async () => {
    if (!newEntityAttributes) {
      history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`);
    }
  }, []);

  useAsyncEffect(async () => {
    if (action === 'edit' && newEntityAttributes) {
      const [rowData] = await queryInstance(
        { operation: 'search_by_hash', schema, table, hash_values: [hash], get_attributes: Object.keys(newEntityAttributes) },
        auth,
        url,
        compute_stack_id,
        customer_id
      );
      delete rowData.__createdtime__; // eslint-disable-line no-underscore-dangle
      delete rowData.__updatedtime__; // eslint-disable-line no-underscore-dangle
      setRowValue(rowData);
    } else {
      setRowValue(newEntityAttributes);
    }
  }, [hash]);

  const submitRecord = async (e) => {
    e.preventDefault();
    if (!rowValue) alert.error('Please insert valid JSON to proceed');
    if (!action || !rowValue) return false;
    if (action === 'edit') rowValue[hashAttribute] = hash;
    await queryInstance({ operation: action === 'edit' ? 'update' : 'insert', schema, table, records: [rowValue] }, auth, url, compute_stack_id, customer_id);
    instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
    return setTimeout(() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`), 1000);
  };

  const deleteRecord = async (e) => {
    e.preventDefault();
    if (!action) return false;
    await queryInstance({ operation: 'delete', schema, table, hash_values: [hash] }, auth, url, compute_stack_id, customer_id);
    return setTimeout(() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`), 100);
  };

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <span className="floating-card-header">
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
                  default: theme === 'dark' ? '#aaa' : '#000',
                  colon: theme === 'dark' ? '#aaa' : '#000',
                  keys: theme === 'dark' ? '#aaa' : '#000',
                  string: '#13c664',
                  number: '#ea4c89',
                  primitive: '#ffa500',
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
              <Button block color="black" onClick={() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`)}>
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
    </ErrorBoundary>
  );
};
