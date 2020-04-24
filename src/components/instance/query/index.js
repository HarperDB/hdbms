import React, { useState } from 'react';
import { Row, Col } from '@nio/ui-kit';

import DataTable from './datatable';
import EmptyPrompt from './emptyPrompt';
import QueryWindow from './queryWindow';

export default () => {
  const [query, setQuery] = useState(false);

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <QueryWindow setQuery={setQuery} />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        {query ? <DataTable query={query} /> : <EmptyPrompt message="Please enter a query at left" />}
      </Col>
    </Row>
  );
};
