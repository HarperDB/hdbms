import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';

import getComponentFile from '../../../functions/api/instance/getComponentFile';
import setComponentFile from '../../../functions/api/instance/setComponentFile';
import FileBrowser from './FileBrowser';
import EditorWindow from './EditorWindow';
import FileMenu from './FileMenu';
import EditorMenu, { SaveButton } from './EditorMenu';

const auth = { user: 'alex', pass: 'alex' }; 
const url = 'http://localhost:9825';


function getPathRelativeToProjectDir(absolutePath) {

  /*
   * schema: <root_dir>/<projectName>/relative/path/to/file.<ext>
   */

  return absolutePath.split('/').slice(2).join('/');

}

function WebIDE({ fileTree, onSave, onSelect }) {

  const [ isValid, setIsValid ] = useState(true);
  const [ selectedDirectory, setSelectedDirectory ] = useState(null);
  const [ fileInfo, setFileInfo ] = useState({
    content: null,
    path: null,
    project: null
  });

  async function saveCodeToInstance() {

    const payload = {
      auth,
      url,
      project: fileInfo.project,
      file: getPathRelativeToProjectDir(fileInfo.path),
      payload: fileInfo.content
    };

    await setComponentFile(payload);

  }

  // sets file info to file that user selects.
  async function updateSelectedFile({ project, path }) {

    const file = path.split(`components/${project}`).filter(Boolean)[0]; 
    const { message: fileContent } = await getComponentFile({
      auth,
      url,
      project,
      file
    });

    setFileInfo({
      content: fileContent,
      path,
      project
    });

  }

  function onCodeUpdate(updatedCode) {
    setFileInfo({
      ...fileInfo,
      content: updatedCode
    });
  }

  // onselect calls get component file, sets code to that, passes that to editor window
  return (
    <Row className="web-ide">
      <Col md="3" className="file-browser-container">
        <FileMenu />
        <FileBrowser
          files={ fileTree }
          selectedFile={ fileInfo?.path }
          selectedDirectory={ selectedDirectory }
          userOnSelect={ onSelect }
          onDirectorySelect={ setSelectedDirectory }
          onFileSelect={ updateSelectedFile } />
      </Col>
      <Col className="code-editor-container">
        <Card style={{ height: '100%' }}>
          <EditorMenu
            onSave={ saveCodeToInstance }
            SaveButton={ () => 
              <SaveButton
                disabled={ !isValid }
                onSave={ saveCodeToInstance } /> 
            } />
          <EditorWindow
            fileInfo={ fileInfo }
            onChange={ onCodeUpdate }
            onValidate={(errors) => {
              setIsValid(errors.length === 0);
            }}
          />
        </Card>
      </Col>
    </Row>

  );
}

export default WebIDE;
