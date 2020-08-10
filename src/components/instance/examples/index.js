import React from 'react';
import { Col, Row } from 'reactstrap';
import { useParams } from 'react-router-dom';

import EntityManager from './entityManager';
import CodeViewer from './codeViewer';

export default ({ showCustomMessage }) => {
  const { folder } = useParams();

  return (
    <Row id="support">
      <Col xl="3" lg="4" md="5" xs="12">
        <EntityManager type="folder" />
        {folder && <EntityManager type="method" />}
      </Col>
      <Col xl="9" lg="8" md="7" xs="12">
        <CodeViewer showCustomMessage={showCustomMessage} />
      </Col>
    </Row>
  );
};
