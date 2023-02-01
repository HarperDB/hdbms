import React, { useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../functions/state/instanceState';
import appState from '../../../functions/state/appState';

import queryInstance from '../../../functions/api/queryInstance';
import addError from '../../../functions/api/lms/addError';
import ErrorFallback from '../../shared/ErrorFallback';

function JsonViewer({ newEntityAttributes, hashAttribute }) {
  const { customer_id, schema, table, hash, action, compute_stack_id } = useParams();
  const alert = useAlert();
  const navigate = useNavigate();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const theme = useStoreState(appState, (s) => s.theme);
  const [currentValue, setCurrentValue] = useState({});
  const [rowValue, setRowValue] = useState({});
  const [confirmDelete, setConfirmDelete] = useState();
  const [validJSON, setValidJSON] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const baseUrl = `/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`;

  useAsyncEffect(async () => {
    if (!newEntityAttributes) {
      navigate(baseUrl);
    }
  }, []);

  useAsyncEffect(async () => {
    if (action === 'edit') {
      const typedHash = Number.isInteger(hash) ? parseInt(hash, 10) : hash;
      const [rowData] = await queryInstance({ operation: { operation: 'search_by_hash', schema, table, hash_values: [typedHash], get_attributes: ['*'] }, auth, url });
      if (rowData) {
        const hash_attribute = rowData[hashAttribute];
        const createdtime = rowData.__createdtime__; // eslint-disable-line no-underscore-dangle
        const updatedtime = rowData.__updatedtime__; // eslint-disable-line no-underscore-dangle
        delete rowData.__createdtime__; // eslint-disable-line no-underscore-dangle
        delete rowData.__updatedtime__; // eslint-disable-line no-underscore-dangle
        delete rowData[hashAttribute]; // eslint-disable-line no-underscore-dangle
        setCurrentValue({ [hashAttribute]: hash_attribute, ...rowData, __createdtime__: createdtime, __updatedtime__: updatedtime });
      } else {
        navigate(baseUrl);
        alert.error('Unable to find record with that hash_attribute');
      }
    } else {
      setCurrentValue(newEntityAttributes || {});
    }
  }, [hash]);

  const submitRecord = async (e) => {
    e.preventDefault();
    if (!rowValue || !validJSON) alert.error('Please insert valid JSON to proceed');
    if (!action || !rowValue || !validJSON) return false;

    setSaving(true);
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
    return setTimeout(() => navigate(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`), 1000);
  };

  const deleteRecord = async (e) => {
    e.preventDefault();
    if (!action) return false;
    setDeleting(true);
    await queryInstance({ operation: { operation: 'delete', schema, table, hash_values: [hash] }, auth, url });
    return setTimeout(() => navigate(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`), 100);
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
            {action === 'add' && (
              <>
                <li>
                  The hash_attribute for this table is &quot;<b>{hashAttribute}</b>&quot;, and will auto-generate. You may manually add it if you want to specify its value.
                </li>
                <li>
                  <b>You may paste in an array</b> if you want to add more than one record at a time.
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
                waitAfterKeyPress={30000}
                onBlur={(value) => {
                  setValidJSON(!value.error);
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
                <Button
                  disabled={saving || deleting}
                  id="backToTable"
                  block
                  color="black"
                  onClick={() => navigate(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${table}`)}
                >
                  <i className="fa fa-chevron-left" />
                </Button>
              )}
            </Col>
            {action === 'add' ? (
              <Col md="8">
                <Button disabled={saving} id="addEditItem" className="mt-2" onClick={submitRecord} block color="success">
                  <i className={`fa ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`} />
                </Button>
              </Col>
            ) : confirmDelete ? (
              <>
                <Col md="4" className="mt-2">
                  <Button disabled={saving || deleting} id="cancelDelete" block color="black" onClick={() => setConfirmDelete(false)}>
                    <i className="fa fa-ban" />
                  </Button>
                </Col>
                <Col md="4">
                  <Button disabled={saving || deleting} id="deleteRecord" className="mt-2" onClick={deleteRecord} block color="success">
                    <i className={`fa ${deleting ? 'fa-spinner fa-spin' : 'fa-check'}`} />
                  </Button>
                </Col>
              </>
            ) : (
              <>
                <Col md="4" className="mt-2">
                  <Button disabled={saving || deleting} id="confirmDelete" block color="danger" onClick={() => setConfirmDelete(hash)}>
                    <i className="fa fa-trash" />
                  </Button>
                </Col>
                <Col md="4">
                  <Button disabled={saving} id="addEditItem" className="mt-2" onClick={submitRecord} block color="success">
                    <i className={`fa ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`} />
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </CardBody>
      </Card>
    </ErrorBoundary>
  );
}

export default JsonViewer;
