import React, { useState, useEffect, lazy } from 'react';
import { Row, Col } from 'reactstrap';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../functions/state/instanceState';

import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
import useInstanceAuth from '../../../functions/state/instanceAuths';
import EmptyPrompt from '../../shared/EmptyPrompt';
import buildInstanceStructure from '../../../functions/instance/buildInstanceStructure';

const DataTable = lazy(() => import(/* webpackChunkName: "browse-datatable" */ './BrowseDatatable'));
const EntityManager = lazy(() => import(/* webpackChunkName: "browse-entitymanager" */ './EntityManager'));
const JSONViewer = lazy(() => import(/* webpackChunkName: "browse-jsonviewer" */ './JsonViewer'));
const CSVUpload = lazy(() => import(/* webpackChunkName: "browse-csvupload" */ './CsvUpload'));
const StructureReloader = lazy(() => import(/* webpackChunkName: "structure-reloader" */ '../../shared/StructureReloader'));

const defaultTableState = {
  tableData: [],
  dataTableColumns: [],
  filtered: [],
  sorted: [],
  page: 0,
  pageSize: 20,
  autoRefresh: false,
  showFilter: false,
  newEntityAttributes: false,
  hashAttribute: false,
};

function BrowseIndex() {
  const history = useHistory();
  const { schema, table, action, customer_id, compute_stack_id } = useParams();
  const [instanceAuths] = useInstanceAuth({});
  const auth = instanceAuths && instanceAuths[compute_stack_id];
  const url = useStoreState(instanceState, (s) => s.url);
  const structure = useStoreState(instanceState, (s) => s.structure);
  const [entities, setEntities] = useState({ schemas: [], tables: [], activeTable: false });
  const [tableState, setTableState] = useState(defaultTableState);
  const baseUrl = `/o/${customer_id}/i/${compute_stack_id}/browse`;
  const showForm = instanceAuths[compute_stack_id]?.super;
  const emptyPromptMessage = showForm
    ? `Please ${(schema && entities.tables && !entities.tables.length) || !entities.schemas.length ? 'create' : 'choose'} a ${schema ? 'table' : 'schema'}`
    : "This user has not been granted access to any tables. A super-user must update this user's role.";

  useEffect(() => {
    if (structure) {
      const schemas = Object.keys(structure);
      const tables = Object.keys(structure?.[schema] || {});

      switch (true) {
        case !schemas.length && history.location.pathname !== '/browse':
          setEntities({ schemas: [], tables: [], activeTable: false });
          history.push(`/o/${customer_id}/i/${compute_stack_id}/browse`);
          break;
        case schemas.length && !schemas.includes(schema):
          history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schemas[0]}`);
          break;
        case tables.length && !tables.includes(table):
          history.push(`/o/${customer_id}/i/${compute_stack_id}/browse/${schema}/${tables[0]}`);
          break;
        default:
          if (entities.activeTable !== `${compute_stack_id}:${schema}:${table}`) {
            setTableState(defaultTableState);
          }
          setEntities({ schemas, tables, activeTable: `${compute_stack_id}:${schema}:${table}` });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structure, schema, table, compute_stack_id]);

  useEffect(() => buildInstanceStructure({ auth, url }), [auth, url, schema, table]);

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
          <EntityManager activeItem={schema} items={entities.schemas} baseUrl={baseUrl} itemType="schema" showForm={showForm} />
          {schema && <EntityManager activeItem={table} items={entities.tables} activeSchema={schema} baseUrl={`${baseUrl}/${schema}`} itemType="table" showForm={showForm} />}
          <StructureReloader centerText label="refresh schemas and tables" />
        </ErrorBoundary>
      </Col>
      <Col xs="12" className="d-block d-md-none">
        <hr />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
          {schema && table && action === 'csv' && entities.activeTable ? (
            <CSVUpload />
          ) : schema && table && action && entities.activeTable ? (
            <JSONViewer newEntityAttributes={tableState.newEntityAttributes} hashAttribute={tableState.hashAttribute} />
          ) : schema && table && entities.activeTable ? (
            <DataTable activeTable={entities.activeTable} tableState={tableState} setTableState={setTableState} />
          ) : (
            <EmptyPrompt message={emptyPromptMessage} />
          )}
        </ErrorBoundary>
      </Col>
    </Row>
  );
}

export default BrowseIndex;
