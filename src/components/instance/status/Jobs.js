import React, { useState } from 'react';
import { useStoreState } from 'pullstate';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import useInterval from 'use-interval';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import instanceState from '../../../functions/state/instanceState';
import config from '../../../config';

import searchJobsByStartDate from '../../../functions/api/instance/searchJobsByStartDate';
import JobRow from './JobsRow';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';

let controller;

const Jobs = () => {
  const { customer_id, compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const jobs = useStoreState(instanceState, (s) => s.jobs);
  const jobsError = useStoreState(instanceState, (s) => s.jobsError);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [mounted, setMounted] = useState(false);

  useAsyncEffect(
    async () => {
      if (mounted) {
        setLoading(true);
        controller = new AbortController();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const toDate = tomorrow.toISOString().split('T')[0];
        tomorrow.setFullYear(tomorrow.getFullYear() - 1);
        const fromDate = tomorrow.toISOString().split('T')[0];
        await searchJobsByStartDate({
          auth,
          signal: controller.signal,
          url,
          currentJobCount: jobs?.length || 0,
          from_date: fromDate,
          to_date: toDate,
          is_local,
          compute_stack_id,
          customer_id,
        });
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
    if (autoRefresh && mounted) setLastUpdate(Date.now());
  }, config.refresh_content_interval);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <Row className="floating-card-header">
        <Col>jobs</Col>
        <Col xs="12" className="d-inline-flex d-md-none mb-2" />
        <Col className="text-md-right">
          <Button color="link" title="Update Jobs" className="mr-2" onClick={() => setLastUpdate(Date.now())}>
            <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
          </Button>
          <Button color="link" title="Turn on autofresh" onClick={() => setAutoRefresh(!autoRefresh)}>
            <span className="mr-2">auto</span>
            <i className={`fa fa-lg fa-toggle-${autoRefresh ? 'on' : 'off'}`} />
          </Button>
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
            {loading && !jobs && !autoRefresh ? (
              <div className="pt-5 text-center">
                <i className="fa fa-spinner fa-spin text-lightgrey" />
              </div>
            ) : jobs?.length ? (
              jobs.map((j) => <JobRow key={j.id} {...j} />)
            ) : (
              <div className="pt-5 text-center">no jobs found</div>
            )}
          </div>
        </CardBody>
      </Card>
    </ErrorBoundary>
  );
};

export default Jobs;
