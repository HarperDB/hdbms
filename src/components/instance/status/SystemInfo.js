import React, { useEffect, useState } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../functions/state/appState';
import instanceState from '../../../functions/state/instanceState';

import updateSystemInfo from '../../../functions/api/instance/updateSystemInfo';
import ContentContainer from '../../shared/ContentContainer';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';

let controller;

function SystemInfo() {
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const systemInfo = useStoreState(instanceState, (s) => s.systemInfo);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const storage = useStoreState(instanceState, (s) => s.storage);
  const iopsAlarms = useStoreState(appState, (s) => s.alarms && s.alarms[compute_stack_id]?.alarmCounts['Disk I/O'], [compute_stack_id]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(!systemInfo?.totalMemory);

  const fetchData = async () => {
    setLoading(true);
    controller = new AbortController();
    await updateSystemInfo({ auth, url, is_local, signal: controller.signal, refresh: !!systemInfo, previousSystemInfo: systemInfo });
    setLoading(false);
  };

  useEffect(() => {
    if (auth && !systemInfo?.totalMemory) fetchData();

    return () => {
      controller?.abort();
    };
    // eslint-disable-next-line
  }, [auth]);

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
      <Row className="floating-card-header">
        <Col>host system</Col>
        <Col className="text-end">
          <Button color="link" title="Update Metrics" className="me-2" onClick={fetchData}>
            <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`} />
          </Button>
          <Button color="link" title="Turn on autofresh" onClick={() => setAutoRefresh(!autoRefresh)}>
            <span className="me-2">auto</span>
            <i className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} />
          </Button>
        </Col>
      </Row>
      <Card className="my-3 instance-details">
        <CardBody>
          {!systemInfo && !autoRefresh ? (
            <div className="pt-5 text-center">
              <i className="fa fa-spinner fa-spin text-purple" />
            </div>
          ) : (
            <Row>
              <Col>
                <ContentContainer header="Total Memory" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.totalMemory || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col>
                <ContentContainer header="Active Memory" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.usedMemory || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col>
                <ContentContainer header="Available Memory" className="mb-3">
                  <div className={`nowrap-scroll text-${systemInfo?.memoryStatus || 'grey'}`}>{systemInfo?.freeMemory || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col>
                <ContentContainer header="CPU Cores" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.cpuCores || '...'}</div>
                </ContentContainer>
              </Col>
              <Col>
                <ContentContainer header="CPU Load" className="mb-3">
                  <div className={`nowrap-scroll text-${systemInfo?.cpuStatus || 'grey'}`}>{systemInfo?.cpuLoad || '...'}%</div>
                </ContentContainer>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
      <br />
    </ErrorBoundary>
  );
}
export default SystemInfo;
