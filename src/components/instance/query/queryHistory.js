import React, { useEffect, Fragment } from 'react';
import { CardBody, Card, Row, Col, Button } from 'reactstrap';
import { useParams } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import useQueryHistory from '../../../state/instanceQueries';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default ({ setQuery, query }) => {
  const { customer_id, compute_stack_id } = useParams();
  const [queries, setQueries] = useQueryHistory({});

  useEffect(() => {
    if (query.lastUpdate) {
      const newQueries = (queries && queries[compute_stack_id]?.filter((q) => q.query.toLowerCase() !== query.query.toLowerCase())) || [];
      newQueries.unshift(query);
      setQueries({ ...queries, [compute_stack_id]: newQueries });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <div id="query-history">
        <Row className="floating-card-header">
          <Col xs="9">query history (click to load)</Col>
          <Col xs="3" className="text-right">
            <Button color="link" title="Refresh Results" className="mr-2" onClick={() => setQueries({ ...queries, [compute_stack_id]: [] })}>
              <i className="fa fa-trash" />
            </Button>
          </Col>
        </Row>
        <Card className="my-3">
          {queries && queries[compute_stack_id]?.length ? (
            <CardBody className="query-scroller">
              {queries[compute_stack_id].map((q) => (
                <Fragment key={q.query}>
                  <button type="button" tabIndex="0" title={`Load query: ${q.query}`} className="past-query" onClick={() => setQuery(q.query)}>
                    <span>{q.query}</span>
                  </button>
                  <hr className="my-0" />
                </Fragment>
              ))}
            </CardBody>
          ) : (
            <CardBody className="text-center text-grey">no queries yet</CardBody>
          )}
        </Card>
      </div>
    </ErrorBoundary>
  );
};
