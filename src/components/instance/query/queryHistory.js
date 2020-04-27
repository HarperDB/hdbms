import React, { useEffect } from 'react';
import { CardBody, Card } from '@nio/ui-kit';

import useQueryHistory from '../../../state/queryHistory';

export default ({ setQuery, query: { query } }) => {
  const [queries, setQueries] = useQueryHistory([]);

  useEffect(() => {
    if (query) {
      const newQueries = queries.filter((q) => q.toLowerCase() !== query.toLowerCase());
      newQueries.unshift(query);
      setQueries(newQueries);
    }
  }, [query]);

  return (
    <div id="query-history">
      <span className="text-white floating-card-header">query history (click to load)</span>
      <Card className="mt-3 mb-4">
        <CardBody className="query-scroller">
          {queries.length ? (
            queries.map((q) => (
              <div className="past-query" key={q} onClick={() => setQuery({ lastUpdate: Date.now(), query: q })}>
                {q}
              </div>
            ))
          ) : (
            <div className="past-query text-center text-grey">no queries yet</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
