import React, { useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { useParams } from 'react-router-dom';

import EntityManager from './EntityManager';
import CodeViewer from './CodeViewer';

const ExamplesIndex = ({ showCustomMessage }) => {
  const { folder } = useParams();

  useEffect(() => {
    if (window.ORIBI) window.ORIBI.api('track', `visited ${showCustomMessage ? 'resources' : 'instance'} - example code`);
  }, [showCustomMessage]);

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

export default ExamplesIndex;
