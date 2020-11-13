import React, { useState, useEffect } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import useInterval from 'use-interval';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import appState from '../../../functions/state/appState';
import instanceState from '../../../functions/state/instanceState';
import config from '../../../config';

import systemInformation from '../../../functions/api/instance/systemInformation';
import ContentContainer from '../../shared/ContentContainer';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
import IopsInfoModal from '../../shared/IopsInfoModal';

let controller;

const SystemInfo = () => {
  const { customer_id } = useParams();
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const systemInfo = useStoreState(instanceState, (s) => s.systemInfo);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const storage = useStoreState(instanceState, (s) => s.storage);
  const iopsAlarms = useStoreState(appState, (s) => s.alarms && s.alarms[compute_stack_id]?.alarmCounts['Disk I/O'], [compute_stack_id]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      controller = new AbortController();
      await systemInformation({ auth, url, signal: controller.signal, refresh: !!systemInfo });
      if (isMounted) setLoading(false);
    };

    if (auth) fetchData();

    return () => {
      controller?.abort();
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, lastUpdate]);

  useInterval(() => auth && autoRefresh && setLastUpdate(Date.now()), config.refresh_content_interval);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <Row className="floating-card-header">
        <Col>host system</Col>
        <Col xs="12" className="d-inline-flex d-md-none mb-2" />
        <Col className="text-md-right">
          <Button color="link" title="Update Metrics" className="mr-2" onClick={() => setLastUpdate(Date.now())}>
            <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
          </Button>
          <Button color="link" title="Turn on autofresh" onClick={() => setAutoRefresh(!autoRefresh)}>
            <span className="mr-2">auto</span>
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
                  <div className={`nowrap-scroll text-${systemInfo?.cpuStatus || 'grey'}`}>{systemInfo.cpuLoad || '...'}%</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Network Volume Up" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.networkTransfered || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Network Volume Down" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo?.networkReceived || '...'}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Network Latency" className="mb-3">
                  <div className={`nowrap-scroll text-${systemInfo?.networkLatencyStatus || 'grey'}`}>{systemInfo?.networkLatency || '...'}ms</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Disk IOPS" subheader={<IopsInfoModal error={iopsAlarms} iops={storage?.iops} />} className="mb-3">
                  <div className={`nowrap-scroll text-${iopsAlarms ? 'danger' : ''}`}>{is_local ? 'HARDWARE LIMIT' : storage?.iops || '...'}</div>
                </ContentContainer>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
      <br />
    </ErrorBoundary>
  );
};
export default SystemInfo;
