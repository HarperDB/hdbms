import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';

import getComponentFile from '../../../functions/api/instance/getComponentFile';
import FileBrowser from './FileBrowser';
import EditorWindow from './EditorWindow';
import FileMenu from './FileMenu';


function WebIDE({ fileTree, onSave, onSelect }) {

  const [ selectedDirectory, setSelectedDirectory ] = useState(null);
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
      file: path.split(`components/${project}`).filter(Boolean)[0] // note: leading '/' seems to be ok w/ 4.2 api
    });

    setFileInfo({ content: message, path });

  }

  async function updateSelectedDirectory(directoryName) {

    setSelectedDirectory(directoryName);

  }


  // onselect calls get component file, sets code to that, passes that to editor window
  return (
    <Row className="web-ide">
      <Col className="file-browser-container">
        <FileMenu />
        <FileBrowser
          files={ fileTree }
          selectedFile={ fileInfo?.path }
          selectedDirectory={ selectedDirectory }
          userOnSelect={ onSelect }
          onDirectorySelect={ updateSelectedDirectory }
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
