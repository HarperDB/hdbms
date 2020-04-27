import React, { useEffect } from 'react';
import { CardBody, Card } from '@nio/ui-kit';
import { useParams } from 'react-router';

import useQueryHistory from '../../../state/instanceQueries';

export default ({ setQuery, query: { query } }) => {
  const { compute_stack_id } = useParams();
  const [queries, setQueries] = useQueryHistory({});

  useEffect(() => {
    if (query) {
      const newQueries = (queries && queries[compute_stack_id]?.filter((q) => q.toLowerCase() !== query.toLowerCase())) || [];
      newQueries.unshift(query);
      setQueries({ ...queries, [compute_stack_id]: newQueries });
    }
  }, [query]);

  return (
    <div id="query-history">
      <span className="text-white floating-card-header">query history (click to load)</span>
      <Card className="mt-3 mb-4">
        {queries && queries[compute_stack_id]?.length ? (
          <CardBody className="query-scroller">
            {queries[compute_stack_id].map((q) => (
              <div className="past-query" key={q} onClick={() => setQuery({ lastUpdate: Date.now(), query: q })}>
                {q}
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
