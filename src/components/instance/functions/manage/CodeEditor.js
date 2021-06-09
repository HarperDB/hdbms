import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import instanceState from '../../../../functions/state/instanceState';
import getCustomFunction from '../../../../functions/api/instance/getCustomFunction';
import setCustomFunction from '../../../../functions/api/instance/setCustomFunction';
import restartService from '../../../../functions/api/instance/restartService';

const CodeEditor = ({ refreshCustomFunctions, loading, restarting }) => {
  const { compute_stack_id, project, type, file } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const directory = useStoreState(instanceState, (s) => s.custom_functions?.directory);
  const [code, setCode] = useState();
  const alert = useAlert();

  const setEditorToFile = useCallback(async () => {
    if (project && type && file && file !== 'undefined') {
      const endpoint_code = await getCustomFunction({ auth, url, project, type, file });
      setCode(endpoint_code?.message);
    }
  }, [auth, url, project, type, file, setCode]);

  const handleSubmit = async () => {
    const response = await setCustomFunction({ auth, url, function_content: code, project, type, file });

    if (response.error) {
      alert.error(response.message);
    } else {
      restartService({ auth, url, service: 'custom_functions' });
      alert.success(response.message);
    }
    setEditorToFile();
  };

  useEffect(() => setEditorToFile(), [project, file, setEditorToFile, compute_stack_id]);

  return (
    <>
      <Row className="floating-card-header">
        <Col>
          edit{' '}
          <i>
            {directory}/{project}/{type}/{file}.js
          </i>
        </Col>
        <Col className="text-end">
          <Button disabled={loading} color="link" onClick={refreshCustomFunctions}>
            <span className="me-2">refresh endpoints</span>
            <i title="Refresh Endpoint Files" className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
          </Button>
          <span className="mx-3 text">|</span>
          <Button disabled={restarting} color="link" onClick={() => restartService({ auth, url, service: 'custom_functions' })} className="me-2">
            <span className="me-2">restart custom functions server</span>
            <i title="Refresh Endpoint Files" className={`fa ${restarting ? 'fa-spinner fa-spin' : 'fa-stop-circle'}`} />
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
