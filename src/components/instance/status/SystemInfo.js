import React, { useState, useEffect } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import useInterval from 'use-interval';
import { ErrorBoundary } from 'react-error-boundary';
import appState from '../../../functions/state/appState';
import instanceState from '../../../functions/state/instanceState';
import config from '../../../config';
import updateSystemInfo from '../../../functions/api/instance/updateSystemInfo';
import ContentContainer from '../../shared/ContentContainer';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
let controller;
function SystemInfo() {
  const computeStackId = useStoreState(instanceState, s => s.computeStackId);
  const auth = useStoreState(instanceState, s => s.auth);
  const url = useStoreState(instanceState, s => s.url);
  const systemInfo = useStoreState(instanceState, s => s.systemInfo);
  const isLocal = useStoreState(instanceState, s => s.isLocal);
  const storage = useStoreState(instanceState, s => s.storage);
  const iopsAlarms = useStoreState(appState, s => s.alarms && s.alarms[computeStackId]?.alarmCounts['Disk I/O'], [computeStackId]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  async function fetchSystemInfo(useCache = false) {
    if (useCache) {
      await updateSystemInfo({
        auth,
        url,
        isLocal,
        signal: controller.signal,
        refresh: !!systemInfo,
        previousSystemInfo: systemInfo,
        skip: ['disk', 'network']
      });
    } else {
      await updateSystemInfo({
        auth,
        url,
        isLocal,
        signal: controller.signal,
        refresh: !!systemInfo,
        previousSystemInfo: systemInfo
      });
    }
  }
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      controller = new AbortController();
      await fetchSystemInfo(!!lastUpdate);
      if (isMounted) setLoading(false);
    };
    if (auth) fetchData();
    return () => {
      controller?.abort();
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, lastUpdate]);
  useInterval(() => {
    if (auth && autoRefresh) {
      setLastUpdate(Date.now());
    }
  }, config.refreshContentInterval);
  return <ErrorBoundary onError={(error, componentStack) => addError({
    error: {
      message: error.message,
      componentStack
    }
  })} FallbackComponent={ErrorFallback}>
      <Row className="floating-card-header">
        <Col>host system</Col>
        <Col className="text-end">
          <Button color="link" title="Update Metrics" className="me-2" onClick={async () => {
          setLoading(true);
          await fetchSystemInfo(false);
          setLoading(false);
        }}>
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
          {!systemInfo && !autoRefresh ? <div className="pt-5 text-center">
              <i className="fa fa-spinner fa-spin text-purple" />
            </div> : <Row>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Total Memory" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.totalMemory || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Active Memory" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.usedMemory || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Available Memory" className="mb-3">
                  <div className={`nowrap-scroll text-${systemInfo?.memoryStatus || 'grey'}`}>{systemInfo?.freeMemory || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Total Disk" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.totalDisk || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Used Disk" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.usedDisk || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Free Disk" className="mb-3">
                  <div className={`nowrap-scroll text-${systemInfo?.diskStatus || 'grey'}`}>{systemInfo?.freeDisk || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="CPU Cores" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.cpuCores || '...'}</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="CPU Load" className="mb-3">
                  <div className={`nowrap-scroll text-${systemInfo?.cpuStatus || 'grey'}`}>{systemInfo?.cpuLoad || '...'}%</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Network Volume Up" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.networkTransferred || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Network Volume Down" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.networkReceived || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Network Latency" className="mb-3">
                  <div className={`nowrap-scroll text-${systemInfo?.networkLatencyStatus || 'grey'}`}>
                    {systemInfo?.networkLatency ? `${systemInfo?.networkLatency} ms` : 'N/A'}
                  </div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Disk IOPS" className="mb-3">
                  <div className={`nowrap-scroll text-${iopsAlarms ? 'danger' : ''}`}>{isLocal ? 'HARDWARE LIMIT' : storage?.iops || '...'}</div>
                </ContentContainer>
              </Col>
            </Row>}
        </CardBody>
      </Card>
      <br />
    </ErrorBoundary>;
}
export default SystemInfo;