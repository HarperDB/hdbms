import React, { useState, useEffect, lazy } from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';
import instanceState from '../../../functions/state/instanceState';
import describeTable from '../../../functions/api/instance/describeTable';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
import useInstanceAuth from '../../../functions/state/instanceAuths';
import EmptyPrompt from '../../shared/EmptyPrompt';
import buildInstanceStructure from '../../../functions/instance/browse/buildInstanceStructure';
const DataTable = lazy(() => import(/* webpackChunkName: "browse-datatable" */'./BrowseDatatable'));
const EntityManager = lazy(() => import(/* webpackChunkName: "browse-entitymanager" */'./EntityManager'));
const JSONEditor = lazy(() => import(/* webpackChunkName: "browse-jsonviewer" */'./JSONEditor'));
const CSVUpload = lazy(() => import(/* webpackChunkName: "browse-csvupload" */'./CsvUpload'));
const StructureReloader = lazy(() => import(/* webpackChunkName: "structure-reloader" */'../../shared/StructureReloader'));
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
  hashAttribute: false
};
function NoPrimaryKeyMessage({
  table
}) {
  return <Card className="my-3 missing-primary-key">
      <CardBody>
        <CardTitle>No Primary Key</CardTitle>
        <i className="fa fa-warning mt-3" />
        <span className="mt-3">
          The table {`'${table}'`} does not have a primary key. The HarperDB Studio does not currently support tables without a primary key defined. Please see the{' '}
          <a href="https://docs.harperdb.io/docs" target="_blank" rel="noreferrer">
            HarperDB documention
          </a>{' '}
          to see the standard HarperDB querying options.
        </span>
      </CardBody>
    </Card>;
}
function BrowseIndex() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    schema,
    table,
    action,
    customerId,
    computeStackId
  } = useParams();
  const [instanceAuths] = useInstanceAuth({});
  const auth = instanceAuths && instanceAuths[computeStackId];
  const url = useStoreState(instanceState, s => s.url);
  const registration = useStoreState(instanceState, s => s.registration);
  const version = registration?.version;
  const [major, minor] = version?.split('.') || [];
  const versionAsFloat = `${major}.${minor}`;
  const structure = useStoreState(instanceState, s => s.structure);
  const [entities, setEntities] = useState({
    schemas: [],
    tables: [],
    activeTable: false
  });
  const [tableState, setTableState] = useState(defaultTableState);
  const baseUrl = `/o/${customerId}/i/${computeStackId}/browse`;
  const showForm = instanceAuths[computeStackId]?.super || instanceAuths[computeStackId]?.structure === true;
  const showTableForm = showForm || instanceAuths[computeStackId]?.structure && instanceAuths[computeStackId]?.structure?.includes(schema);
  const emptyPromptMessage = showForm ? `Please ${schema && entities.tables && !entities.tables.length || !entities.schemas.length ? 'create' : 'choose'} a ${schema ? 'table' : `${versionAsFloat >= 4.2 ? 'database' : 'schema'}`}` : "This user has not been granted access to any tables. A super-user must update this user's role.";
  const [hasHashAttr, setHasHashAttr] = useState(true);
  const syncInstanceStructure = () => {
    buildInstanceStructure({
      auth,
      url
    });
  };
  const checkForHashAttribute = () => {
    async function check() {
      if (table) {
        const result = await describeTable({
          auth,
          url,
          schema,
          table
        });
        setHasHashAttr(Boolean(result.hashAttribute));
      }
    }
    check();
  };
  useEffect(checkForHashAttribute, [auth, url, schema, table]);
  const validate = () => {
    if (structure) {
      /*
       * FIXME: There is a fair amount of logic scattered throughout this
       * page that could be put in a router-level validation function.
       *
       * Splitting the browse endpoint into /schema/ and /schema/table hierarchy
       * might ease this.
       *
       */

      const schemas = Object.keys(structure);
      const tables = Object.keys(structure?.[schema] || {});
      if (!schemas.length && location.pathname !== '/browse') {
        setEntities({
          schemas: [],
          tables: [],
          activeTable: false
        });
        navigate(`/o/${customerId}/i/${computeStackId}/browse`);
        return;
      }

      // redirect to a valid schema if path doesn't match database's schema
      if (schemas.length && !schemas.includes(schema)) {
        navigate(`/o/${customerId}/i/${computeStackId}/browse/${schemas[0]}`);
        return;
      }

      // redirect to a valid table if path doesn't match database's schema
      if (tables.length && !tables.includes(table)) {
        navigate(`/o/${customerId}/i/${computeStackId}/browse/${schema}/${tables[0]}`);
        return;
      }
      if (entities.activeTable !== `${computeStackId}:${schema}:${table}`) {
        setTableState(defaultTableState);
      }
      setEntities({
        schemas,
        tables,
        activeTable: `${computeStackId}:${schema}:${table}`
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(validate, [structure, schema, table, computeStackId]);
  useEffect(syncInstanceStructure, [auth, url, schema, table]);
  return <Row id="browse">
      <Col xl="3" lg="4" md="5" xs="12">
        <ErrorBoundary onError={(error, componentStack) => addError({
        error: {
          message: error.message,
          componentStack
        }
      })} FallbackComponent={ErrorFallback}>
          <EntityManager activeItem={schema} items={entities.schemas} baseUrl={baseUrl} itemType={versionAsFloat >= 4.2 ? 'database' : 'schema'} showForm={showForm} />
          {schema && <EntityManager activeItem={table} items={entities.tables} activeSchema={schema} baseUrl={`${baseUrl}/${schema}`} itemType="table" showForm={showTableForm} />}
          <StructureReloader centerText label={`refresh ${versionAsFloat >= 4.2 ? 'databases' : 'schemas'} and tables`} />
        </ErrorBoundary>
      </Col>
      <Col xs="12" className="d-block d-md-none">
        <hr />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        <ErrorBoundary onError={(error, componentStack) => addError({
        error: {
          message: error.message,
          componentStack
        }
      })} FallbackComponent={ErrorFallback}>
          {schema && table && action === 'csv' && entities.activeTable ? <CSVUpload /> : schema && table && action && entities.activeTable ? <JSONEditor newEntityAttributes={tableState.newEntityAttributes} hashAttribute={tableState.hashAttribute} /> : schema && table && entities.activeTable ? <DataTable activeTable={entities.activeTable} tableState={tableState} setTableState={setTableState} /> : schema && table && !hasHashAttr ? <NoPrimaryKeyMessage /> : <EmptyPrompt headline={emptyPromptMessage} icon={<i className="fa fa-exclamation-triangle text-warning" />} />}
        </ErrorBoundary>
      </Col>
    </Row>;
}
export default BrowseIndex;