import React, { useState } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import useInterval from 'use-interval';
import useAsyncEffect from 'use-async-effect';

import instanceState from '../../../state/instanceState';
import config from '../../../../config';

import searchJobsByStartDate from '../../../api/instance/searchJobsByStartDate';
import JobRow from './instanceJobsRow';

export default () => {
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const jobs = useStoreState(instanceState, (s) => s.jobs);
  const jobsError = useStoreState(instanceState, (s) => s.jobsError);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [mounted, setMounted] = useState(false);
  const today = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 1);
  const fromDate = `${defaultStartDate.getFullYear()}-${defaultStartDate.getMonth() < 10 ? '0' : ''}${defaultStartDate.getMonth()}-${
    defaultStartDate.getDate() < 10 ? '0' : ''
  }${defaultStartDate.getDate()}`;
  const toDate = `${today.getFullYear()}-${today.getMonth() < 10 ? '0' : ''}${today.getMonth()}-${today.getDate() < 10 ? '0' : ''}${today.getDate()}`;
  let controller;

  useAsyncEffect(
    async () => {
      if (mounted) {
        setLoading(true);
        controller = new AbortController();
        await searchJobsByStartDate({ auth, signal: controller.signal, url, currentJobCount: jobs?.length || 0, from_date: fromDate, to_date: toDate });
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
        <Col>instance jobs</Col>
        <Col xs="12" className="d-inline-flex d-md-none mb-2" />
        <Col className="text-md-right">
          <i title="Update Jobs" className={`fa mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} onClick={() => setLastUpdate(Date.now())} />
          <span className="mr-2">auto</span>
          <i title="Turn on autofresh" className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} onClick={() => setAutoRefresh(!autoRefresh)} />
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className="text-small">
          <Row>
            <Col xs="3">
              <b>status</b>
            </Col>
            <Col xs="3">
              <b>date</b>
            </Col>
            {jobsError ? (
              <Col xs="6" className="text-right text-danger">
                <b>job fetch error: {new Date().toLocaleTimeString().toLowerCase()}</b>
              </Col>
            ) : (
              <>
                <Col xs="3">
                  <b>start</b>
                </Col>
                <Col xs="3">
                  <b>end</b>
                </Col>
              </>
            )}
          </Row>
          <hr className="mt-1 mb-0" />
          <div className="log-scroller">
            {(loading || !jobs) && !autoRefresh ? (
              <div className="pt-5 text-center">
                <i className="fa fa-spinner fa-spin text-lightgrey" />
              </div>
            ) : jobs.length ? (
              jobs.map((j) => <JobRow key={j.id} {...j} />)
            ) : (
              <div className="pt-5 text-center">no jobs found</div>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
};
