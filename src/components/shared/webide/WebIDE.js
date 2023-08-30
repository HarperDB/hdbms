import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';

import getComponentFile from '../../../functions/api/instance/getComponentFile';
import setComponentFile from '../../../functions/api/instance/setComponentFile';
import dropComponentFile from '../../../functions/api/instance/dropComponentFile';
import addComponent from '../../../functions/api/instance/addComponent';
import setComponentDirectory from '../../../functions/api/instance/setComponentDirectory';
import FileBrowser from './FileBrowser';
import EditorWindow from './EditorWindow';
import FileMenu, { AddFileButton, AddFolderButton, DeleteFolderButton, NameInput } from './FileMenu';
import EditorMenu, { SaveButton } from './EditorMenu';

const auth = { user: 'alex', pass: 'alex' }; 
const applicationsAPIUrl = 'http://localhost:9925';


/*
 * Parse the relative path, which is what the components api expects.
 *
 * note: While 'components' root is not shown in the app,
 * the full path is components/<project name>/relative/path/to/file.js
 */

function getRelativeFilepath(absolutePath) {

  return absolutePath.split('/').slice(2).join('/');

}

async function onFileRename(file) {
  /*
  await setComponentFile({
    auth,
    applicationsAPIUrl,
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
  const hasProjects = fileTree?.entries?.length > 0;
  const canAddFile = Boolean(hasProjects && selectedDirectory);  // can only add a file if a target folder is selected
  const canDeleteFolder = Boolean(hasProjects && selectedDirectory);  // can only add a file if a target folder is selected

  // save file to instance 
  async function saveCodeToInstance() {

    const payload = {
      auth,
      url: applicationsAPIUrl,
      project: fileInfo.project,
      file: getRelativeFilepath(fileInfo.path), //TODO: doublecheck this path logic
      payload: fileInfo.content
    };

    await setComponentFile(payload);

  }

  // fetches file from instance and sets in memory file object to that.
  async function selectNewFile({ project, path }) {

    const file = getRelativeFilepath(path);
    const { message: fileContent } = await getComponentFile({
      auth,
      url: applicationsAPIUrl,
      project,
      file
    });

    setFileInfo({
      content: fileContent,
      path,
      project
    });

  }

  // updates current in memory code
  function updateInMemoryCodeFile(updatedCode) {

    setFileInfo({
      ...fileInfo,
      content: updatedCode
    });

  }

  async function createNewFile(newFilename) {

    const { path, project } = selectedDirectory;
    const relativeDirpath = getRelativeFilepath(path);
    const relativeFilepath = relativeDirpath ? `${relativeDirpath}/${newFilename}` : newFilename;
    const [ basename ] = relativeFilepath.split('/').slice(-1);

    await setComponentFile({
      auth,
      url: applicationsAPIUrl,
      project,
      file: relativeFilepath,
      payload: `// file: ${basename}`
    });

    await onUpdate();


    resetEditingInput();

  }

  async function createNewFolder(newFolderName) {

    const newProject = !selectedDirectory;

    /*
     * to create a base-level (project) folder, we have to call addComponent which creates a project.
     * to create a subdir of a project, we call add component file w/ no payload or name extension
     */ 

    if (newProject) {
      await addComponent({
        auth,
        url: applicationsAPIUrl,
        project: newFolderName
      })
    } else {

      const { path, project } = selectedDirectory;
      const relativeDirpath = getRelativeFilepath(path);
      const relativeFilepath = relativeDirpath ? `${relativeDirpath}/${newFolderName}` : newFolderName;

      await setComponentFile({
        auth,
        url: applicationsAPIUrl,
        project: selectedDirectory.project, 
        file: relativeFilepath
      })
    }

    await onUpdate();

    resetEditingInput();
  }

  async function deleteFolder() {

    const { path, project } = selectedDirectory;
    const targetDirpath = getRelativeFilepath(path);

    console.log('delete: ', { project, file: targetDirpath});

    // if we're deleting as top-level directory, that's a project,
    // so don't pass a file. otherwise pass project name and file/dir
    // relative to project name as 'file'.
    if (targetDirpath.length > 0) {
      await dropComponentFile({
        auth,
        url: applicationsAPIUrl,
        project,
        file: targetDirpath
      });
    } else {
      await dropComponentFile({
        auth,
        url: applicationsAPIUrl,
        project
      });
    }

    await onUpdate();

    setSelectedDirectory(null);

  }


  function resetEditingInput() {

    setEditingFileName(false);
    setEditingFolderName(false);

  }

  function enableFileNameInput(e) {

    setEditingFileName(true);
    setEditingFolderName(false);

  }

  function enableFolderNameInput() {

    setEditingFileName(false);
    setEditingFolderName(true);

  }


  return (
    <Row className="web-ide">
      <Col md="3" className="file-browser-container">
        <FileMenu
          AddFileButton={
            () => (
              <AddFileButton
                onAddFile={ enableFileNameInput }
                disabled={ !canAddFile } /> 
            )
          }
          AddFolderButton={
            () => <AddFolderButton onAddFolder={ enableFolderNameInput } />
          }
          DeleteFolderButton={
            () => <DeleteFolderButton disabled={ !canDeleteFolder } onDeleteFolder={ deleteFolder } />
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
          root={ fileTree.path }
          selectedFile={ fileInfo?.path }
          selectedDirectory={ selectedDirectory }
          userOnSelect={ onSelect }
          onFileRename={ onFileRename }
          onDirectorySelect={ setSelectedDirectory }
          onFileSelect={ selectNewFile } />
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
            onChange={ updateInMemoryCodeFile }
            onValidate={(errors) => {
              setIsValid(errors.length === 0);
            }}
          />
      </Col>
    </Row>

  );
}

export default WebIDE;
