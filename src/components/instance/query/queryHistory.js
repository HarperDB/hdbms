import React, { useEffect } from 'react';
import { CardBody, Card, Row, Col } from '@nio/ui-kit';
import { useParams } from 'react-router';

import useQueryHistory from '../../../state/instanceQueries';

export default ({ setQuery, query }) => {
  const { compute_stack_id } = useParams();
  const [queries, setQueries] = useQueryHistory({});

  useEffect(() => {
    if (query.lastUpdate) {
      const newQueries = (queries && queries[compute_stack_id]?.filter((q) => q.query.toLowerCase() !== query.query.toLowerCase())) || [];
      newQueries.unshift(query);
      setQueries({ ...queries, [compute_stack_id]: newQueries });
    }
  }, [query]);

  return (
    <div id="query-history">
      <Row className="floating-card-header">
        <Col xs="9">query history (click to load)</Col>
        <Col xs="3" className="text-right">
          <i onClick={() => setQueries({ ...queries, [compute_stack_id]: [] })} className="fa fa-trash clickable" />
        </Col>
      </Row>
      <Card className="mt-3 mb-4">
        {queries && queries[compute_stack_id]?.length ? (
          <CardBody className="query-scroller">
            {queries[compute_stack_id].map((q) => (
              <div className="past-query" key={q.query} onClick={() => setQuery(q.query)}>
                {q.query}
              </div>
            ))}
          </CardBody>
        ) : (
          <CardBody className="text-center text-grey">no queries yet</CardBody>
        )}
      </Card>
    </div>
  );
};