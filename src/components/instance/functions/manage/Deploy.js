import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useHistory } from 'react-router';
import useAsyncEffect from 'use-async-effect';

import appState from '../../../../functions/state/appState';
import instanceState from '../../../../functions/state/instanceState';

import DataTable from '../../../shared/DataTable';
import buildCustomFunctionDeployColumns from '../../../../functions/instance/buildCustomFunctionDeployColumns';
import useInstanceAuth from '../../../../functions/state/instanceAuths';
import packageCustomFunctionProject from '../../../../functions/api/instance/packageCustomFunctionProject';

const defaultTableState = {
  filtered: [],
  sorted: [],
  page: 0,
  totalPages: 1,
  pageSize: 20,
  autoRefresh: false,
  showFilter: false,
  lastUpdate: false,
};

const Deploy = () => {
  const { customer_id, compute_stack_id, project } = useParams();
  const history = useHistory();
  const [instanceAuths] = useInstanceAuth({});
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const [{ payload, file }, setPayloadAndFile] = useState([]);
  const returnUrl = `/o/${customer_id}/i/${compute_stack_id}/functions/edit/${project}`;
  const tableData = useStoreState(appState, (s) => s.instances.filter((i) => i.compute_stack_id !== compute_stack_id));
  const dataTableColumns = buildCustomFunctionDeployColumns({ project, payload, file, loading: !payload, instanceAuths });
  const [tableState, setTableState] = useState(defaultTableState);

  useAsyncEffect(async () => {
    if (auth && url && project) {
      setPayloadAndFile(false);
      const payloadAndFile = await packageCustomFunctionProject({ auth, url, project });
      setPayloadAndFile(payloadAndFile);
    }
  }, [auth, url, project]);

  useEffect(() => {
    setTableState({
      ...tableState,
      totalPages: Math.ceil((tableData.length || tableState.pageSize) / tableState.pageSize),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTableState, tableState.pageSize]);

  const handleReturn = () => history.push(returnUrl);

  return (
    <>
      <Row className="floating-card-header">
        <Col>deploy {project && `> ${project}`}</Col>
        <Col className="text-end">
          <Button onClick={handleReturn} color="link" className="me-2">
            <span className="me-2">edit {project} project</span>
            <i title="Edit Project" className="fa fa-edit" />
          </Button>
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className="react-table-holder">
          {tableData.length ? (
            <DataTable
              columns={dataTableColumns}
              data={tableData}
              page={tableState.page}
              pageSize={tableState.pageSize}
              totalPages={tableState.totalPages}
              showFilter={tableState.showFilter}
              sorted={tableState.sorted}
              onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
              onSortedChange={(value) => setTableState({ ...tableState, sorted: value })}
              onPageChange={(value) => setTableState({ ...tableState, pageSize: value })}
              onPageSizeChange={(value) => setTableState({ ...tableState, page: 0, pageSize: value })}
            />
          ) : (
            <div className="empty-prompt">Please register at least one Custom Function-enabled instance to deploy to</div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default Deploy;
