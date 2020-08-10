import React, { useState, useEffect, lazy } from 'react';
import { Row, Col } from 'reactstrap';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../state/instanceState';

import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';
import useInstanceAuth from '../../../state/instanceAuths';

const DataTable = lazy(() => import(/* webpackChunkName: "browse-datatable" */ './datatable'));
const EntityManager = lazy(() => import(/* webpackChunkName: "browse-entitymanager" */ './entityManager'));
const JSONViewer = lazy(() => import(/* webpackChunkName: "browse-jsonviewer" */ './jsonviewer'));
const CSVUpload = lazy(() => import(/* webpackChunkName: "browse-csvupload" */ './csvupload'));
const EmptyPrompt = lazy(() => import(/* webpackChunkName: "browse-emptyprompt" */ './emptyPrompt'));
const StructureReloader = lazy(() => import(/* webpackChunkName: "structure-reloader" */ '../../shared/structureReloader'));

const defaultTableState = {
  tableData: [],
  totalPages: 0,
  totalRecords: 0,
  loading: false,
  filtered: [],
  sorted: [],
  page: 0,
  pageSize: 20,
  autoRefresh: false,
  showFilter: false,
  newEntityAttributes: false,
  hashAttribute: false,
  dataTableColumns: [],
};

export default () => {
  const history = useHistory();
  const { compute_stack_id, schema, table, action, customer_id } = useParams();
  const structure = useStoreState(instanceState, (s) => s.structure, [compute_stack_id]);
  const [entities, setEntities] = useState({ schemas: [], tables: [], activeTable: false });
  const [tableState, setTableState] = useState(defaultTableState);
  const baseUrl = `/o/${customer_id}/i/${compute_stack_id}/browse`;
  const [instanceAuths] = useInstanceAuth({});
  const showForm = instanceAuths[compute_stack_id]?.super;

  useEffect(() => {
    if (structure) {
      const schemas = Object.keys(structure);
      const tables = Object.keys(structure?.[schema] || {});
      const activeTable = structure?.[schema]?.[table];

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
          setEntities({ schemas, tables, activeTable });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structure, schema, table, compute_stack_id]);

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <ErrorBoundary
          onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
          FallbackComponent={ErrorFallback}
        >
          <EntityManager activeItem={schema} items={entities.schemas} baseUrl={baseUrl} itemType="schema" showForm={showForm} />
          {schema && <EntityManager activeItem={table} items={entities.tables} activeSchema={schema} baseUrl={`${baseUrl}/${schema}`} itemType="table" showForm={showForm} />}
          <StructureReloader centerText label="refresh schemas and tables" />
        </ErrorBoundary>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        <ErrorBoundary
          onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
          FallbackComponent={ErrorFallback}
        >
          {schema && table && action === 'csv' && entities.activeTable ? (
            <CSVUpload />
          ) : schema && table && action && entities.activeTable ? (
            <JSONViewer newEntityAttributes={tableState.newEntityAttributes} hashAttribute={tableState.hashAttribute} />
          ) : schema && table && entities.activeTable ? (
            <DataTable activeTable={entities.activeTable} tableState={tableState} setTableState={setTableState} defaultTableState={defaultTableState} />
          ) : (
            <EmptyPrompt
              message={`Please ${(schema && entities.tables && !entities.tables.length) || !entities.schemas.length ? 'create' : 'choose'} a ${schema ? 'table' : 'schema'}`}
            />
          )}
        </ErrorBoundary>
      </Col>
    </Row>
  );
};
