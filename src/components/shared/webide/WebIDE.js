import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import FileBrowser from './FileBrowser';
import FileMenu, {
  AddFileButton,
  AddProjectFolderButton,
  AddProjectButton,
  DeleteFolderButton,
  DeleteFileButton,
  InstallPackageButton
} from './FileMenu';
import EditorMenu, { SaveButton } from './EditorMenu';
import Editor from './Editor'; 
import EditorWindow, {
  EDITOR_WINDOWS,
  InstallPackageWindow,
  BlankWindow,
  DeployComponentWindow,
  NoFileSelectedWindow,
  NameFileWindow,
  NameProjectFolderWindow,
  NameProjectWindow,
  PackageDetailsWindow
} from './EditorWindow';

import NameInput from './NameInput';

import useInstanceAuth from '../../../functions/state/instanceAuths';

function WebIDE({ fileTree, deployTargets, onSave, onUpdate, onInstallPackage, onDeployProject, onAddFile, onAddProjectFolder, onAddProject, onFileSelect, onFileRename, onFolderRename, onDeleteFile, onDeleteFolder }) {

  const [ selectedFolder, setSelectedFolder ] = useState(null);
  const [ selectedFile, setSelectedFile ] = useState(null);       // selectedFile = { content, path: /components/project/rest/of/path.js, project }
  const [ selectedPackage, setSelectedPackage ] = useState(null); // selectedPackage = { name, url }
  const [ editingFileName, setEditingFileName ] = useState(false); 
  const [ editingFolderName, setEditingFolderName ] = useState(false); 
  const [ showInstallPackageWindow, setShowInstallPackageWindow ] = useState(false);
  const [ activeEditorWindow, setActiveEditorWindow ] = useState(EDITOR_WINDOWS.BLANK_WINDOW); 
  const [ previousActiveEditorWindow, setPreviousActiveEditorWindow ] = useState(null);


  const hasProjects = fileTree?.entries?.length > 0;
  const canAddFile = Boolean(hasProjects && selectedFolder);  // can only add a file if a target folder is selected
  const canDeleteFolder = Boolean(hasProjects && selectedFolder);  // can only delete a folder if a target folder is selected
  const canAddProjectFolder = Boolean(selectedFolder); // can only add a file if a target folder is selected

  async function addProject(newProjectName) {
    onAddProject(newProjectName);
    updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
  }

  async function addProjectFolder(newFolderName) {
    onAddProjectFolder(newFolderName, selectedFolder)
    // go back to prev window
    updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
  }

  async function installPackage(projectName, packageUrl) {

    await onInstallPackage(projectName, packageUrl);

    setSelectedPackage(null);
    updateActiveEditorWindow(EDITOR_WINDOWS.DEFAULT_WINDOW, activeEditorWindow);

  }

  async function addFile(newFilename) {
    const fileInfo = await onAddFile(newFilename, selectedFolder);
    // show file in editor window.

    setSelectedFile(fileInfo);
    updateActiveEditorWindow(EDITOR_WINDOWS.CODE_EDITOR_WINDOW, activeEditorWindow);
  }

  function updateActiveEditorWindow(to, from) {
    // TODO: figure out correct logic here. 
    setActiveEditorWindow(to);
    setPreviousActiveEditorWindow(from);
  }

  function toDefaultWindow() {
    updateActiveEditorWindow(EDITOR_WINDOWS.BLANK_WINDOW, activeEditorWindow);
  }

  function backToPreviousWindow() {
    // TODO: this needs some thought.  unexpected 'no action' behavior.
    updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
  }

  // updates current in memory code
  function updateInMemoryCodeFile(updatedCode) {
 
    const update = {
      ...selectedFile,
      content: updatedCode
    };

    setSelectedFile(update);

  }
 
  return (
    <Row className="web-ide">
      <Col md="3" className="file-browser-container">
        <FileMenu>
          <AddProjectButton
            onAddProject={
              () => {
                updateActiveEditorWindow(EDITOR_WINDOWS.NAME_PROJECT_WINDOW, activeEditorWindow);
              }
            } />
          <AddProjectFolderButton
            disabled={ !canAddProjectFolder }
            onAddProjectFolder={() => {
              updateActiveEditorWindow(EDITOR_WINDOWS.NAME_PROJECT_FOLDER_WINDOW, activeEditorWindow);
            }} />
          <DeleteFolderButton
            disabled={ !canDeleteFolder }
            onDeleteFolder={
              async () => {
                await onDeleteFolder(selectedFolder);
                updateActiveEditorWindow(EDITOR_WINDOWS.BLANK_WINDOW, activeEditorWindow);
                setSelectedFile(null);
                setSelectedFolder(null);
              }
            } />
          <AddFileButton
            onAddFile={() => {
              updateActiveEditorWindow(EDITOR_WINDOWS.NAME_FILE_WINDOW, activeEditorWindow);
            }}
            disabled={ !canAddFile } /> 
          <DeleteFileButton
            disabled={ !selectedFile?.path }
            onDeleteFile={
              (e) => {
                // bug here? is selectedFile reset when i think it is? 
                onDeleteFile(selectedFile);
                setSelectedFile(null);
                setSelectedFolder(null);
                updateActiveEditorWindow(EDITOR_WINDOWS.BLANK_WINDOW, activeEditorWindow);
              }
            } />
          <InstallPackageButton
            onClick={
              () => {
                setSelectedPackage(null);
                updateActiveEditorWindow(EDITOR_WINDOWS.INSTALL_PACKAGE_WINDOW, activeEditorWindow)
              }
            }
            />
        </FileMenu>
        <FileBrowser
          files={ fileTree }
          root={ fileTree.path }
          selectedFile={ selectedFile?.path }
          selectedFolder={ selectedFolder }
          onFolderRename={() => {
            // updateActiveEditorWindow(EDITOR_WINDOWS.RENAME_FOLDER_WINDOW, activeEditorWindow);
          }}
          onFileRename={() => {
            // updateActiveEditorWindow(EDITOR_WINDOWS.RENAME_FILE_WINDOW, activeEditorWindow);
          }}
          onDeployProject={
            (e) => {
              // opens deploy window
              updateActiveEditorWindow(EDITOR_WINDOWS.DEPLOY_COMPONENT_WINDOW, activeEditorWindow);
            }
          }
          onFolderSelect={setSelectedFolder}
          onPackageSelect={
            ({ name, url }) => {
              setSelectedPackage({ name, url });
              updateActiveEditorWindow(EDITOR_WINDOWS.INSTALL_PACKAGE_WINDOW, activeEditorWindow)
            }
          }
          onFileSelect={
            async (entry) => {
              const { content } = await onFileSelect(entry);
              setSelectedFile({
                ...entry,
                content
              });
              updateActiveEditorWindow(EDITOR_WINDOWS.CODE_EDITOR_WINDOW, activeEditorWindow);
            } 
          } />
      </Col>
      <Col className="code-editor-container">
        <EditorMenu
          SaveButton={ 
            () => (
              <SaveButton
                disabled={ !selectedFile }
                onSave={
                  () => {
                    // NOTE: timeout for ux reasons.
                    setTimeout(() => {
                      onSave(selectedFile)
                    }, 200);
                  }
                } />
            )
          }
        />
        <EditorWindow>
          <BlankWindow fileTree={fileTree} active={ activeEditorWindow === 'BLANK_WINDOW' } />
          <NoFileSelectedWindow active={ activeEditorWindow === 'NO_FILE_SELECTED_WINDOW' } />
          <NameProjectWindow
            active={ activeEditorWindow === 'NAME_PROJECT_WINDOW' } 
            onConfirm={ addProject }
            onCancel={ toDefaultWindow } />
          <NameProjectFolderWindow
            projectName={selectedFolder?.project}
            active={ activeEditorWindow === 'NAME_PROJECT_FOLDER_WINDOW' } 
            onConfirm={ addProjectFolder }
            onCancel={ toDefaultWindow } />
          <NameFileWindow 
            active={ activeEditorWindow === 'NAME_FILE_WINDOW' } 
            onConfirm={ addFile }
            onCancel={ toDefaultWindow } />
          <InstallPackageWindow
            reinstallable={ fileTree.entries.filter(e => e.name === selectedPackage?.name) }
            active={ activeEditorWindow === 'INSTALL_PACKAGE_WINDOW' } 
            selectedPackage={ selectedPackage }
            onConfirm={ installPackage }
            onCancel={ toDefaultWindow } />
          <DeployComponentWindow
            onConfirm={
              (project, deployTarget) => {
                onDeployProject({ project, deployTarget });
              }
            }
            onCancel={ toDefaultWindow }
            project={ selectedFolder }
            active={ activeEditorWindow === 'DEPLOY_COMPONENT_WINDOW' }
            deployTargets={ deployTargets }
          />
          <Editor
            active={ activeEditorWindow === 'CODE_EDITOR_WINDOW' }
            file={ selectedFile }
            onChange={ updateInMemoryCodeFile } />
        </EditorWindow>
      </Col>
    </Row>
  );
}

export default WebIDE;
