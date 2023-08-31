import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';
import cn from 'classnames';

import getComponentFile from '../../../functions/api/instance/getComponentFile';
import setComponentFile from '../../../functions/api/instance/setComponentFile';
import addComponent from '../../../functions/api/instance/addComponent';
import dropComponent from '../../../functions/api/instance/dropComponent';
import FileBrowser from './FileBrowser';
import EditorWindow from './EditorWindow';
import FileMenu, { AddFileButton, AddFolderButton, DeleteFolderButton, DeleteFileButton } from './FileMenu';
import EditorMenu, { SaveButton } from './EditorMenu';
import NameInput from './NameInput';

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


function WebIDE({ fileTree, onSave, onSelect, onUpdate }) {

  const [ isValid, setIsValid ] = useState(true);
  const [ selectedDirectory, setSelectedDirectory ] = useState(null);
  const [ selectedFile, setSelectedFile ] = useState(null); // selectedFile = { content, path, project }
  const [ editingFileName, setEditingFileName ] = useState(false); 
  const [ editingFolderName, setEditingFolderName ] = useState(false); 
  const [ renamingFile, setRenamingFile ] = useState(false); 
  const [ renamingFolder, setRenamingFolder ] = useState(false); 

  const hasProjects = fileTree?.entries?.length > 0;
  const canAddFile = Boolean(hasProjects && selectedDirectory);  // can only add a file if a target folder is selected
  const canDeleteFolder = Boolean(hasProjects && selectedDirectory);  // can only add a file if a target folder is selected
  const filenameDialogEnabled = editingFileName || editingFolderName || renamingFile || renamingFolder;

  async function renameFile(newFileName, info) {

    const { path, name, content, project } = info;
    const parentDir = getRelativeFilepath(path).split('/').slice(0, -1).join('/'); 
    const newFilenameRelativePath = parentDir ? `${parentDir}/${newFileName}` : newFileName; 

    await dropComponent({
      auth,
      url: applicationsAPIUrl,
      project,
      file: getRelativeFilepath(path)
    });

    await setComponentFile({
      auth,
      url: applicationsAPIUrl,
      project,
      file: newFilenameRelativePath,
      payload: content
    })

    onUpdate();

  }

  async function renameFolder(newFileName, info) {

    const fileContent = await getComponentFile({
      url: applicationsAPIUrl,
      auth,
      project: info.project,
      file: getRelativeFilepath(info.path)
    })
  }


  async function onFileRename(file) {


    if (file.entries) {
      enableRenameFolderInput();
    } else {
      enableRenameFileInput();
    }

    /*
    await setComponentFile({
      auth,
      applicationsAPIUrl,
      project,
      file
    });
    */
  }
  // save file to instance 
  async function saveCodeToInstance() {

    const payload = {
      auth,
      url: applicationsAPIUrl,
      project: selectedFile.project,
      file: getRelativeFilepath(selectedFile.path), //TODO: doublecheck this path logic
      payload: selectedFile.content
    };

    await setComponentFile(payload);

  }

  // updates current in memory code
  function updateInMemoryCodeFile(updatedCode) {

    setSelectedFile({
      ...selectedFile,
      content: updatedCode
    });

  }

  // fetches file from instance and sets in memory file object to that.
  async function selectNewFile({ project, path, name }) {

    const file = getRelativeFilepath(path);
    const { message: fileContent } = await getComponentFile({
      auth,
      url: applicationsAPIUrl,
      project,
      file
    });

    setSelectedFile({
      content: fileContent,
      path,
      project,
      name
    });

  }

  async function createNewFile(newFilename) {

    const { path, project } = selectedDirectory;
    const relativeDirpath = getRelativeFilepath(path);
    const relativeFilepath = relativeDirpath ? `${relativeDirpath}/${newFilename}` : newFilename;
    const [ basename ] = relativeFilepath.split('/').slice(-1);
    const payload = `// file: ${basename}`; // FIXME: can't save a file w/ empty payload. request change? 

    await setComponentFile({
      auth,
      url: applicationsAPIUrl,
      project,
      file: relativeFilepath,
      payload
    });

    await onUpdate();

    resetEditingInputs();

    // this isn't triggering panel.
    setSelectedFile({
      project,
      path: relativeFilepath,
      content: payload
    });

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

    // make sure to set the selected directory to newly created one.
    resetEditingInputs();
    await onUpdate();

  }

  async function deleteFile() {

    const { path, project } = selectedFile;

    await dropComponent({
      auth,
      url: applicationsAPIUrl,
      project,
      file: getRelativeFilepath(path)
    });

    setSelectedFile(null);

    await onUpdate();

  }

  async function deleteFolder() {

    const { path, project } = selectedDirectory;
    const targetDirpath = getRelativeFilepath(path);

    // if we're deleting as top-level directory, that's a project,
    // so don't pass a file. otherwise pass project name and file/dir
    // relative to project name as 'file'.
    if (targetDirpath.length > 0) {
      await dropComponent({
        auth,
        url: applicationsAPIUrl,
        project,
        file: targetDirpath
      });
    } else {
      await dropComponent({
        auth,
        url: applicationsAPIUrl,
        project
      });
    }


    setSelectedDirectory(null);
    resetEditingInputs();

    await onUpdate();

  }


  function resetEditingInputs() {

    setEditingFileName(false);
    setEditingFolderName(false);
    setRenamingFile(false);
    setRenamingFolder(false);

  }

  function enableRenameFolderInput(e) {

    resetEditingInputs();
    setRenamingFolder(true);

  }

  function enableRenameFileInput(e) {

    resetEditingInputs();
    setRenamingFile(true);

  }

  function enableFileNameInput(e) {

    resetEditingInputs();
    setEditingFileName(true);

  }

  function enableFolderNameInput() {

    resetEditingInputs();
    setEditingFolderName(true);

  }

  function NoFileSelected() {
    return (
      <div>
        No file selected. Please select or create ( <i className="fas fa-plus" /> ) a file using the menu on the left. 
      </div>
    )
  }

  function FilenameDialog() {

    const ModalStyle = {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    return (
      <div style={ ModalStyle } className="filename-dialog">
        <NameInput
          label="Please Choose a New Filename"
          value={selectedFile?.name}
          onBlur={() => { resetEditingInputs() }}
          onConfirm={
            (newName) => {
              renameFile(newName, selectedFile)
              resetEditingInputs();
            }
          }
          enabled={ renamingFile }
          onCancel={() => { resetEditingInputs() }} />
        <NameInput
          label="Please Choose a New Folder Name"
          value={selectedDirectory?.name}
          onConfirm={ (newName) => renameFolder(newName, selectedDirectory) }
          enabled={ renamingFolder }
          onBlur={() => { resetEditingInputs() }}
          onCancel={() => { resetEditingInputs() }} />
        <NameInput
          label="New File Name"
          onConfirm={ createNewFile }
          onCancel={() => { resetEditingInputs() }}
          onBlur={() => { resetEditingInputs() }}
          enabled={ editingFileName } 
        />
        <NameInput
          label="New Folder Name"
          onConfirm={ createNewFolder }
          onCancel={() => { resetEditingInputs()  }}
          onBlur={() => { resetEditingInputs() }}
          enabled={ editingFolderName } 
        />

      </div>
    )
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
          DeleteFileButton={
            () => <DeleteFileButton disabled={ !selectedFile?.path } onDeleteFile={ deleteFile } />
          }
          
        />
        <FileBrowser
          files={ fileTree }
          root={ fileTree.path }
          selectedFile={ selectedFile?.path }
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
          }
        />
        {

          filenameDialogEnabled ?
            <FilenameDialog /> :
            selectedFile ?
              <EditorWindow 
                file={ selectedFile }
                onChange={ updateInMemoryCodeFile }
                onValidate={(errors) => {
                  setIsValid(errors.length === 0);
                }} /> :
              <NoFileSelected />
        }
      </Col>
    </Row>

  );
}


/*
// for instructions and file renaming modal
function FileRenameWindow() {

  const FileRenameWindowStyle = {
    height: "100%",
    width:"100%",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  };

  const showModal = editingFileName || editingFolderName || renamingFile || renamingFolder;

  return ( 
    <div style={FileRenameWindowStyle}>
    { showModal ? <Modal /> : <NoFileSelected /> }
    </div>
  )

}
// TODO: update code using whatever monaco hook is available. onupdate.
// don't allow save if there are errors.
function ManagementWindow({ showModal }) {

  return (
      <Card style={{height: '100%'}}>
        <div style={ManagementPaneStyle}>
        { showModal ? <Modal /> : <NoFileSelected /> }
        </div>
      </Card>
  );

}
*/

export default WebIDE;
