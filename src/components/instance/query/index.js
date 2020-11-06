import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';

import DataTable from './datatable';
import QueryWindow from './queryWindow';
import QueryHistory from './queryHistory';

const QueryIndex = () => {
  const [query, setQuery] = useState(false);

  return (
    <Row id="query">
      <Col xl="3" lg="4" md="5" xs="12">
        <QueryWindow setQuery={setQuery} query={query} />
        <QueryHistory setQuery={setQuery} query={query} />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        <DataTable query={query} />
      </Col>
    </Row>
  );
};

export default QueryIndex;
