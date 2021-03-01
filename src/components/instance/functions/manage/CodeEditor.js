import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import getCustomFunction from '../../../../functions/api/instance/getCustomFunction';
import instanceState from '../../../../functions/state/instanceState';
import setCustomFunction from '../../../../functions/api/instance/setCustomFunction';

const CodeEditor = ({ refreshApi }) => {
  const { endpoint } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const [code, setCode] = useState();
  const alert = useAlert();

  const setEditorToFile = useCallback(async () => {
    const endpoint_code = await getCustomFunction({ auth, url, function_name: endpoint });
    setCode(endpoint_code?.message);
  }, [auth, url, endpoint, setCode]);

  const handleSubmit = async () => {
    const response = await setCustomFunction({ auth, url, function_name: endpoint, function_content: code });

    if (response.error) {
      alert.error(response.message);
    } else {
      alert.success(response.message);
    }
    setEditorToFile();
  };

  useEffect(() => setEditorToFile(), [endpoint, setEditorToFile]);

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
        <CardBody>
          <div className="code-editor-holder">
            <Editor height="100%" defaultLanguage="javascript" value={code} theme="vs-dark" onChange={setCode} />
          </div>
          <Row>
            <Col md="6" className="mt-2">
              <Button id="reset" block color="grey" onClick={setEditorToFile}>
                <i className="fa fa-undo" />
              </Button>
            </Col>
            <Col md="6" className="mt-2">
              <Button id="addEditItem" onClick={handleSubmit} block color="success">
                <i className="fa fa-save" />
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default CodeEditor;
