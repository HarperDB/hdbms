import React, { useState } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';

import instanceState from '../../../state/instanceState';
import systemInformation from '../../../api/instance/systemInformation';
import config from '../../../../config';
import ContentContainer from '../../shared/contentContainer';

export default () => {
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const systemInfo = useStoreState(instanceState, (s) => s.systemInfo);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [mounted, setMounted] = useState(false);
  let controller;

  useAsyncEffect(
    async () => {
      if (mounted) {
        setLoading(true);
        controller = new AbortController();
        await systemInformation({ auth, signal: controller.signal, url, refresh: !!systemInfo });
        setLoading(false);
      }
    },
    () => controller?.abort(),
    [lastUpdate, mounted]
  );

  useAsyncEffect(
    () => setMounted(true),
    () => setMounted(false),
    []
  );

  useInterval(() => {
    if (autoRefresh) setLastUpdate(Date.now());
  }, config.refresh_content_interval);

  return (
    <>
      <Row className="floating-card-header">
        <Col>host system metrics</Col>
        <Col xs="12" className="d-inline-flex d-md-none mb-2" />
        <Col className="text-md-right">
          <i title="Update Metrics" className={`fa mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} onClick={() => setLastUpdate(Date.now())} />
          <span className="mr-2">auto</span>
          <i title="Turn on autofresh" className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} onClick={() => setAutoRefresh(!autoRefresh)} />
        </Col>
      </Row>
      <Card className="my-3 instance-details">
        <CardBody>
          {(loading || !systemInfo) && !autoRefresh ? (
            <div className="pt-5 text-center">
              <i className="fa fa-spinner fa-spin text-lightgrey" />
            </div>
          ) : (
            <Row>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Total Memory" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo.totalMemory}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Used Memory" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo.usedMemory}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Free Memory" className="mb-3">
                  <div className={`nowrap-scroll text-${systemInfo.memoryStatus}`}>{systemInfo.freeMemory}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Total Disk" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo.totalDisk}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Used Disk" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo.usedDisk}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Free Disk" className="mb-3">
                  <div className={`nowrap-scroll text-${systemInfo.diskStatus}`}>{systemInfo.freeDisk}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="CPU Info" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo.cpuInfo}</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="CPU Cores" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo.cpuCores}</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="CPU Load" className="mb-3">
                  <div className={`nowrap-scroll text-${systemInfo.cpuStatus}`}>{systemInfo.cpuLoad}%</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Network Volume Up" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo.networkTransfered}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Network Volume Down" className="mb-3">
                  <div className="nowrap-scroll">{systemInfo.networkReceived}GB</div>
                </ContentContainer>
              </Col>
              <Col md="2" sm="4" xs="6">
                <ContentContainer header="Network latency" className="mb-3">
                  <div className={`nowrap-scroll text-${systemInfo.networkLatencyStatus}`}>{systemInfo.networkLatency}ms</div>
                </ContentContainer>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
      <br />
    </>
  );
};
