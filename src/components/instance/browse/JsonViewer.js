import React, { useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { useHistory, useParams } from 'react-router';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../functions/state/instanceState';
import appState from '../../../functions/state/appState';

import queryInstance from '../../../functions/api/queryInstance';
import addError from '../../../functions/api/lms/addError';
import ErrorFallback from '../../shared/ErrorFallback';

const JsonViewer = ({ newEntityAttributes, hashAttribute }) => {
  const { customer_id, schema, table, hash, action, compute_stack_id } = useParams();
  const alert = useAlert();
  const history = useHistory();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const theme = useStoreState(appState, (s) => s.theme);
  const [currentValue, setCurrentValue] = useState({});
  const [rowValue, setRowValue] = useState({});
  const [confirmDelete, setConfirmDelete] = useState();
  const [changed, setChanged] = useState(false);
  const [validJSON, setValidJSON] = useState(false);
  const baseUrl = `/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`;

  useAsyncEffect(async () => {
    if (!newEntityAttributes) {
      history.push(baseUrl);
    }
  }, []);

  useAsyncEffect(async () => {
    if (action === 'edit') {
      const [rowData] = await queryInstance({ operation: { operation: 'search_by_hash', schema, table, hash_values: [hash], get_attributes: ['*'] }, auth, url });

      if (rowData) {
        delete rowData.__createdtime__; // eslint-disable-line no-underscore-dangle
        delete rowData.__updatedtime__; // eslint-disable-line no-underscore-dangle
        delete rowData[hashAttribute]; // eslint-disable-line no-underscore-dangle
        setCurrentValue(rowData);
      } else {
        history.push(baseUrl);
        alert.error('Unable to find record with that hash_attribute');
      }
    } else {
      setCurrentValue(newEntityAttributes || {});
    }
  }, [hash]);

  const submitRecord = async (e) => {
    e.preventDefault();
    if (!rowValue) alert.error('Please insert valid JSON to proceed');
    if (!action || !rowValue) return false;
    if (action === 'edit') rowValue[hashAttribute] = hash;
    await queryInstance({
      operation: {
        operation: action === 'edit' ? 'update' : 'insert',
        schema,
        table,
        records: action !== 'edit' && Array.isArray(rowValue) ? rowValue : [rowValue],
      },
      auth,
      url,
    });
    instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
    return setTimeout(() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`), 1000);
  };

  const deleteRecord = async (e) => {
    e.preventDefault();
    if (!action) return false;
    await queryInstance({ operation: { operation: 'delete', schema, table, hash_values: [hash] }, auth, url });
    return setTimeout(() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`), 100);
  };

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <span className="floating-card-header">
        {schema} {table && '>'} {table} {action === 'add' ? '> add new' : hash ? `> edit > ${hash}` : ''}
        &nbsp;
      </span>
      <Card className="my-3">
        <CardBody>
          <ul className="text-small">
            <li>
              The auto-maintained fields &quot;<b>__createdtime__</b>&quot; &amp; &quot;<b>__updatedtime__</b>&quot; have been hidden from this view.
            </li>
            {action === 'add' ? (
              <>
                <li>
                  The hash_attribute for this table is &quot;<b>{hashAttribute}</b>&quot;, and will auto-generate. You may manually add it if you want to specify its value.
                </li>
                <li>
                  <b>You may paste in an array</b> if you want to add more than one record at a time.
                </li>
              </>
            ) : (
              <>
                <li>
                  The hash_attribute for this table is &quot;<b>{hashAttribute}</b>&quot;, and has a value of &quot;<b>{hash}</b>&quot;. It has also been hidden from this view.
                </li>
              </>
            )}
          </ul>
          <Card className="mb-2 json-editor-holder">
            <CardBody>
              <JSONInput
                placeholder={currentValue}
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
                style={{
                  warningBox: { display: 'none' },
                }}
                locale={locale}
                width="100%"
                confirmGood={false}
                waitAfterKeyPress={1000}
                onChange={(value) => {
                  setValidJSON(!value.error);
                  setChanged(JSON.stringify(value.jsObject) !== JSON.stringify(currentValue));
                  setRowValue(value.jsObject);
                }}
              />
            </CardBody>
          </Card>
          <Row>
            <Col md="4" className="mt-2">
              {confirmDelete ? (
                <div className="pt-2">Delete this record?</div>
              ) : (
                <Button id="backToTable" block color="black" onClick={() => history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`)}>
                  <i className="fa fa-chevron-left" />
                </Button>
              )}
            </Col>
            {action === 'add' ? (
              <Col md="8">
                <Button disabled={!changed || !validJSON} id="addEditItem" className="mt-2" onClick={submitRecord} block color="success">
                  <i className="fa fa-save" />
                </Button>
              </Col>
            ) : confirmDelete ? (
              <>
                <Col md="4" className="mt-2">
                  <Button id="cancelDelete" block color="black" onClick={() => setConfirmDelete(false)}>
                    <i className="fa fa-ban" />
                  </Button>
                </Col>
                <Col md="4">
                  <Button id="deleteRecord" className="mt-2" onClick={deleteRecord} block color="success">
                    <i className="fa fa-check" />
                  </Button>
                </Col>
              </>
            ) : (
              <>
                <Col md="4" className="mt-2">
                  <Button id="confirmDelete" block color="danger" onClick={() => setConfirmDelete(hash)}>
                    <i className="fa fa-trash" />
                  </Button>
                </Col>
                <Col md="4">
                  <Button disabled={!changed || !validJSON} id="addEditItem" className="mt-2" onClick={submitRecord} block color="success">
                    <i className="fa fa-save" />
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </CardBody>
      </Card>
    </ErrorBoundary>
  );
};

export default JsonViewer;
