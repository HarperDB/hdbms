import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';

import getComponentFile from '../../../functions/api/instance/getComponentFile';
import FileBrowser from './FileBrowser';
import EditorWindow from './EditorWindow';


function WebIDE({ fileTree, onSave, onSelect }) {

  const [ fileInfo, setFileInfo ] = useState({
    content: null,
    path: null
  });

  const auth = { user: 'alex', pass: 'alex' }; 
  const url = 'http://localhost:9825';

  async function updateSelectedFile({ project, path }) {

    const { message } = await getComponentFile({
      auth,
      url,
      project,
      file: path
    });

    setFileInfo({ content: message, path });

  }

  // onselect calls get component file, sets code to that, passes that to editor window
  return (
    <Row className="web-ide">
      <Col className="file-browser-container">
        <FileBrowser
          files={ fileTree }
          selectedFile={ fileInfo?.path }
          userOnSelect={ onSelect }
          onFileSelect={ updateSelectedFile } />
      </Col>
      <Col className="code-editor-container">
        <Card style={{height: '100%' }}>
          <EditorWindow fileInfo={fileInfo} />
        </Card>
      </Col>
    </Row>

  );
}

export default WebIDE;
