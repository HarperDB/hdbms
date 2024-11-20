import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';
import appState from '../../../../../functions/state/appState';
import instanceState from '../../../../../functions/state/instanceState';
import DataTable from '../../../../shared/DataTable';
import buildCustomFunctionDeployColumns from '../../../../../functions/instance/clustering/deployRows';
import useInstanceAuth from '../../../../../functions/state/instanceAuths';
import packageCustomFunctionProject from '../../../../../functions/api/instance/packageCustomFunctionProject';
import customFunctionsStatus from '../../../../../functions/api/instance/customFunctionsStatus';
import getCustomFunctions from '../../../../../functions/api/instance/getCustomFunctions';
import deployCustomFunctionProject from '../../../../../functions/api/instance/deployCustomFunctionProject';
import dropCustomFunctionProject from '../../../../../functions/api/instance/dropCustomFunctionProject';
import installNodeModules from '../../../../../functions/api/instance/installNodeModules';
import restartService from '../../../../../functions/api/instance/restartService';
const defaultTableState = {
  filtered: [],
  sorted: [],
  page: 0,
  totalPages: 1,
  pageSize: 20,
  autoRefresh: false,
  showFilter: false,
  lastUpdate: false
};
function Deploy() {
  const {
    customerId,
    computeStackId,
    project
  } = useParams();
  const navigate = useNavigate();
  const [instanceAuths] = useInstanceAuth({});
  const auth = useStoreState(instanceState, s => s.auth);
  const url = useStoreState(instanceState, s => s.url);
  const version = useStoreState(instanceState, s => s.registration?.version);
  const [{
    payload,
    file
  }, setPayloadAndFile] = useState([]);
  const returnUrl = `/o/${customerId}/i/${computeStackId}/functions/edit/${project}`;
  const instances = useStoreState(appState, s => s.instances.filter(i => i.computeStackId !== computeStackId));
  const [major, minor] = version.split('.');
  const canSkipNodeModules = major >= 3 && (major > 3 || minor >= 3);
  const [tableData, setTableData] = useState([]);
  const [skipNodeModules, setSkipNodeModules] = useState(canSkipNodeModules);
  const [loading, setLoading] = useReducer((state, newState) => ({
    ...state,
    ...newState
  }), {});
  const [tableState, setTableState] = useState(defaultTableState);

  // NOTE: not sure about 'navigate' dep. this was adapted from migration from history to navigate.
  const handleReturn = useCallback(() => navigate(returnUrl), [navigate, returnUrl]);
  const updateInstanceCFStatus = useCallback(async (destinationComputeStackId, action) => {
    const thisInstance = tableData.find(i => i.computeStackId === destinationComputeStackId);
    const instanceAuth = instanceAuths[destinationComputeStackId];
    if (thisInstance && instanceAuth) {
      setLoading({
        [destinationComputeStackId]: action
      });
      let nowHasCurrentProject = false;
      const customFunctionsStatus = await customFunctionsStatus({
        auth: instanceAuth,
        url: thisInstance.url
      });
      if (!customFunctionsStatus.error) {
        const instanceCustomFunctions = await getCustomFunctions({
          auth: instanceAuth,
          url: thisInstance.url
        });
        nowHasCurrentProject = Object.keys(instanceCustomFunctions).includes(project);
      }
      const newTableData = tableData.map(instance => {
        if (instance.computeStackId === destinationComputeStackId) {
          instance.customFunctionsStatus = customFunctionsStatus;
          instance.hasCurrentProject = nowHasCurrentProject;
        }
        return instance;
      });
      setTableData(newTableData);
      setLoading({
        [destinationComputeStackId]: null
      });
    }
  }, [instanceAuths, project, tableData]);
  const handleClick = useCallback(async (destinationComputeStackId, action) => {
    const thisInstance = tableData.find(i => i.computeStackId === destinationComputeStackId);
    const instanceAuth = instanceAuths[destinationComputeStackId];
    if (thisInstance && instanceAuth) {
      setLoading({
        [destinationComputeStackId]: action
      });
      if (action === 'deploy') {
        await deployCustomFunctionProject({
          auth: instanceAuth,
          url: thisInstance.url,
          payload,
          project,
          file
        });
        if (skipNodeModules) {
          await installNodeModules({
            auth: instanceAuth,
            url: thisInstance.url,
            projects: [project]
          });
        }
        await restartService({
          auth: instanceAuth,
          url: thisInstance.url,
          service: 'custom_functions'
        });
      } else {
        await dropCustomFunctionProject({
          auth: instanceAuth,
          url: thisInstance.url,
          project
        });
      }
      setTimeout(() => {
        setLoading({
          [destinationComputeStackId]: false
        });
        updateInstanceCFStatus(destinationComputeStackId, action);
      }, 1000);
    }
  }, [file, instanceAuths, payload, project, tableData, updateInstanceCFStatus, skipNodeModules]);
  useAsyncEffect(async () => {
    if (auth && url && project) {
      setPayloadAndFile(false);
      const payloadAndFile = await packageCustomFunctionProject({
        auth,
        url,
        project,
        skipNodeModules: skipNodeModules
      });
      setPayloadAndFile(payloadAndFile);
    }
  }, [auth, url, project, skipNodeModules]);
  useAsyncEffect(async () => {
    if (instances) {
      const loadedInstances = await Promise.all(instances.map(async instance => {
        const instanceAuth = instanceAuths[instance.computeStackId];
        let instanceCustomFunctions = {};
        if (instanceAuth) {
          const customFunctionsStatus = await customFunctionsStatus({
            auth: instanceAuth,
            url: instance.url
          });
          if (!customFunctionsStatus.error) {
            instanceCustomFunctions = await getCustomFunctions({
              auth: instanceAuth,
              url: instance.url
            });
          }
          return {
            ...instance,
            customFunctionsStatus,
            hasAuth: true,
            hasCurrentProject: Object.keys(instanceCustomFunctions).includes(project)
          };
        }
        return {
          ...instance,
          customFunctionsStatus: false
        };
      }));
      setTableData(loadedInstances);
    }
  }, [instances, project]);
  useEffect(() => {
    setTableState({
      ...tableState,
      totalPages: Math.ceil((tableData.length || tableState.pageSize) / tableState.pageSize)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTableState, tableState.pageSize]);
  return <>
      <Row className="floating-card-header">
        <Col>deploy {project && `> ${project}`}</Col>
        <Col className="text-end">
          {canSkipNodeModules && <>
              <Button color="link" title="Turn on autofresh" onClick={() => setSkipNodeModules(!skipNodeModules)}>
                <span className="me-2">install dependencies at destination</span>
                <i className={`fa fa-lg fa-toggle-${skipNodeModules ? 'on' : 'off'}`} />
              </Button>
              <span className="mx-3 text">|</span>
            </>}
          <Button onClick={handleReturn} color="link" className="me-2">
            <span className="me-2">back to edit</span>
            <i title="Edit Project" className="fa fa-edit" />
          </Button>
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className="react-table-holder">
          {tableData.length ? <DataTable columns={buildCustomFunctionDeployColumns({
          initializing: !payload,
          loading,
          handleClick
        })} data={tableData} page={tableState.page} pageSize={tableState.pageSize} totalPages={tableState.totalPages} showFilter={tableState.showFilter} sorted={tableState.sorted} onFilteredChange={value => setTableState({
          ...tableState,
          filtered: value
        })} onSortedChange={value => setTableState({
          ...tableState,
          sorted: value
        })} onPageChange={value => setTableState({
          ...tableState,
          pageSize: value
        })} onPageSizeChange={value => setTableState({
          ...tableState,
          page: 0,
          pageSize: value
        })} /> : <div className="empty-prompt">Please register at least one Custom Function-enabled instance to deploy to</div>}
        </CardBody>
      </Card>
    </>;
}
export default Deploy;