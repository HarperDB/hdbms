import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';

import getComponentFile from '../../../functions/api/instance/getComponentFile';
import setComponentFile from '../../../functions/api/instance/setComponentFile';
import FileBrowser from './FileBrowser';
import EditorWindow from './EditorWindow';
import FileMenu from './FileMenu';
import EditorMenu from './EditorMenu';

function getPathRelativeToProjectDir(absolutePath) {
  // schema is root_dir/projectName/relativePaths

  const pathRelativeToProjectDir = absolutePath.split('/').slice(2).join('/');
  return pathRelativeToProjectDir;
}

function WebIDE({ fileTree, onSave, onSelect }) {

  const [ selectedDirectory, setSelectedDirectory ] = useState(null);
  const [ fileInfo, setFileInfo ] = useState({
    content: null,
    path: null,
    project: null
  });

  const auth = { user: 'alex', pass: 'alex' }; 
  const url = 'http://localhost:9825';

  async function saveCode() {

    const payload = {
      auth,
      url,
      project: fileInfo.project,
      file: getPathRelativeToProjectDir(fileInfo.path),
      payload: fileInfo.content
    }
    const response = await setComponentFile(payload);

  }

  async function updateSelectedFile({ project, path }) {

    const file = path.split(`components/${project}`).filter(Boolean)[0]; 
    const { message } = await getComponentFile({
      auth,
      url,
      project,
      file
    });

    setFileInfo({ content: message, path, project });

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
          <EditorMenu saveCode={ saveCode } />
          <EditorWindow fileInfo={fileInfo} />
        </Card>
      </Col>
    </Row>

  );
}

export default WebIDE;
