import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';

import getComponentFile from '../../../functions/api/instance/getComponentFile';
import setComponentFile from '../../../functions/api/instance/setComponentFile';
import addComponent from '../../../functions/api/instance/addComponent';
import setComponentDirectory from '../../../functions/api/instance/setComponentDirectory';
import FileBrowser from './FileBrowser';
import EditorWindow from './EditorWindow';
import FileMenu, { AddFileButton, AddFolderButton, NameInput } from './FileMenu';
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

function WebIDE({ fileTree, onSave, onSelect, onUpdate }) {

  const [ isValid, setIsValid ] = useState(true);
  const [ selectedDirectory, setSelectedDirectory ] = useState(null);
  const [ fileInfo, setFileInfo ] = useState({
    content: null,
    path: null,
    project: null
  });
  const [ editingFileName, setEditingFileName ] = useState(false); 
  const [ editingFolderName, setEditingFolderName ] = useState(false); 
  const hasProjects = fileTree.entries.length > 0;

  // if a directory is selected, add file to it. otherwise, this shouldn't be possible.
  const canAddFile = Boolean(hasProjects && selectedDirectory);

  async function saveCodeToInstance() {

    const payload = {
      auth,
      url,
      project: fileInfo.project,
      file: getPathRelativeToProjectDir(fileInfo.path), //TODO: doublecheck this path logic
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
    setEditingFileName(true);
    setEditingFolderName(false);
  }

  function onAddFolder() {

    setEditingFileName(false);
    setEditingFolderName(true);
    // if no selectedDirectory, new name is full path, e.g. components/<new folder name>

    // get full new file path

    // create that via instance op.
    /*
    setComponentDirectory({
      auth,
      url,
      project: 'untitled',
      file: selectedDirectory, 
    });
    */
  }

  async function createNewFile(newFilename) {

    const { path, project } = selectedDirectory;
    const pathSegments = path.split('/').slice(2); // [0] = 'components', [1] = <project_dir>
    const relativeDirPath = pathSegments.join('/');
    const relativeFilepath = relativeDirPath ? `${relativeDirPath}/${newFilename}` : newFilename;

    await setComponentFile({
      auth,
      url,
      project,
      file: relativeFilepath,
      payload: `// ${relativeFilepath}`
    });

    await onUpdate();

  }

  async function createNewFolder(folderName) {

    const newProject = !selectedDirectory;

    /*
     * to create a base-level (project) folder, we have to call addComponent which creates a project.
     * to create a subdir of a project, we call add component file w/ no payload or name extension
     */ 

    // TODO: check for failure, might already exist.
    if (newProject) {
      await addComponent({
        auth,
        url,
        project: folderName
      })
    } else {
      // get the filepath relative to the project directory 
      const { path, project } = selectedDirectory;
      const relativePathStart = `components/${project}`.length;
      const projectDir = path.substr(relativePathStart);
      const relativePath = projectDir.length ? `${projectDir}/${folderName}` : folderName;
      // file should not include 'components/project'
      await setComponentFile({
        auth,
        url,
        project: selectedDirectory.project, 
        file: relativePath
      })
    }

    await onUpdate();
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
              <NameInput
                label="New File Name"
                onConfirm={ createNewFile }
                onCancel={() => { setEditingFileName(false) }}
                isOpen={ editingFileName } 
              />
            )
          }
          NewFolderNameInput={
            () => (
              <NameInput
                label="New Folder Name"
                onConfirm={ createNewFolder }
                onCancel={() => { setEditingFolderName(false) }}
                isOpen={ editingFolderName } 
              />
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
