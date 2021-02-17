import React from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../../functions/state/instanceState';

const CodeEditor = ({ refreshApi }) => {
  const { endpoint } = useParams();
  const custom_api = useStoreState(instanceState, (s) => s.custom_api);

  return (
    <>
      <Row className="floating-card-header">
        <Col>edit endpoint file &gt; {endpoint}</Col>
        <Col className="text-right">
          <Button color="link" onClick={refreshApi} className="mr-2">
            <span className="mr-2">refresh endpoints</span>
            <i title="Refresh Roles" className="fa fa-refresh" />
          </Button>
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className="code-editor-holder">
          <Editor height="100%" defaultLanguage="javascript" defaultValue="// some comment" theme="vs-dark" />
        </CardBody>
      </Card>
    </>
  );
};

export default CodeEditor;
