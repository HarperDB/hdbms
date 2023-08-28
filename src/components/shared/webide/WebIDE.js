import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';

import getComponentFile from '../../../functions/api/instance/getComponentFile';
import setComponentFile from '../../../functions/api/instance/setComponentFile';
import setComponentDirectory from '../../../functions/api/instance/setComponentDirectory';
import FileBrowser from './FileBrowser';
import EditorWindow from './EditorWindow';
import FileMenu, { AddFileButton, AddFolderButton, NewFileNameInput } from './FileMenu';
import EditorMenu, { SaveButton } from './EditorMenu';

const auth = { user: 'alex', pass: 'alex' }; 
const url = 'http://localhost:9825';


function getPathRelativeToProjectDir(absolutePath) {

  /*
   * schema: <root_dir>/<projectName>/relative/path/to/file.<ext>
   */

  return absolutePath.split('/').slice(2).join('/');

}

async function onFileRename(file) {
  /*
  await setComponentFile({
    auth,
    url,
    project,
    file
  });
  */
}

function WebIDE({ fileTree, onSave, onSelect }) {

  const [ isValid, setIsValid ] = useState(true);
  const [ selectedDirectory, setSelectedDirectory ] = useState(null);
  const [ fileInfo, setFileInfo ] = useState({
    content: null,
    path: null,
    project: null
  });
  const hasProjects = fileTree.entries.length > 0;

  // if a directory is selecte, add file to it. otherwise, this shouldn't be possible.
  const canAddFile = Boolean(hasProjects && selectedDirectory);

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

  function onAddFile(e) {
    // traverse file tree until you find entry with path of selectedDirectory.path 
    // add to its entries a  new file
    console.log('add file: ', e, selectedDirectory);
    // add a new file component, with editable to true
    // no default name, just an input

  }

  function onAddFolder() {
    // add file or dir / input component with input engaged.
    // if selectedDir, add to that 
    /*
    setComponentDirectory({
      auth,
      url,
      project: 'untitled',
      file: selectedDirectory, 
    });
    */
  }

  async function onSetNewFileName(name) {
    console.log('new full path: ', `${selectedDirectory?.path}/${name}`);
    // TODO:
    // try to save new file, if error, alert user it's taken.
    // make sure NewFileName component is only rendered when the +file or +folder buttons are pressed. and are not visible after exit or successful save.
  }

  return (
    <Row className="web-ide">
      <Col md="3" className="file-browser-container">
        <FileMenu
          AddFileButton={
            () => (
              <AddFileButton
                onAddFile={ onAddFile }
                disabled={ !canAddFile } /> 
            )
          }
          AddFolderButton={
            () => <AddFolderButton onAddFolder={ onAddFolder } />
          }
          NewFileNameInput={
            () => (
              <NewFileNameInput onSetNewFileName={ onSetNewFileName } />
            )
          }
        />
        <hr />
        <FileBrowser
          files={ fileTree }
          selectedFile={ fileInfo?.path }
          selectedDirectory={ selectedDirectory }
          userOnSelect={ onSelect }
          onFileRename={ onFileRename }
          onDirectorySelect={ setSelectedDirectory }
          onFileSelect={ updateSelectedFile } />
      </Col>
      <Col className="code-editor-container" style={{ height: '100%' }}>
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
      </Col>
    </Row>

  );
}

export default WebIDE;
