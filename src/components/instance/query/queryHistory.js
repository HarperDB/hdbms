import React, { useEffect, Fragment } from 'react';
import { CardBody, Card, Row, Col } from 'reactstrap';
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
            <i title="clear query history" onClick={() => setQueries({ ...queries, [compute_stack_id]: [] })} className="fa fa-trash clickable" />
          </Col>
        </Row>
        <Card className="mt-3 mb-4">
          {queries && queries[compute_stack_id]?.length ? (
            <CardBody className="query-scroller">
              {queries[compute_stack_id].map((q) => (
                <Fragment key={q.query}>
                  <button type="button" tabIndex="0" title={`Load query: ${q.query}`} className="past-query" onClick={() => setQuery(q.query)}>
                    {q.query}
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
