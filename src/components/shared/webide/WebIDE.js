import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import FileBrowser from './FileBrowser';
import FileMenu, { AddFileButton, AddProjectFolderButton, AddProjectButton, DeleteFolderButton, DeleteFileButton, DeployProjectButton } from './FileMenu';
import EditorMenu, { SaveButton } from './EditorMenu';
import Editor from './Editor'; 
import EditorWindow, { EDITOR_WINDOWS, DeployWindow, BlankWindow, NoFileSelectedWindow, NameFileWindow, NameProjectFolderWindow, NameProjectWindow, PackageDetailsWindow } from './EditorWindow';
import NameInput from './NameInput';

function WebIDE({ fileTree, onSave, onUpdate, onDeploy, onAddFile, onAddProjectFolder, onAddProject, onFileSelect, onFileRename, onFolderRename, onDeleteFile, onDeleteFolder }) {

  const [ selectedFolder, setSelectedFolder ] = useState(null);
  const [ selectedFile, setSelectedFile ] = useState(null);       // selectedFile = { content, path: /components/project/rest/of/path.js, project }
  const [ selectedPackage, setSelectedPackage ] = useState(null); // selectedPackage = { name, url }
  const [ editingFileName, setEditingFileName ] = useState(false); 
  const [ editingFolderName, setEditingFolderName ] = useState(false); 
  const [ showDeployWindow, setShowDeployWindow ] = useState(false);
  const [ activeEditorWindow, setActiveEditorWindow ] = useState(EDITOR_WINDOWS.BLANK_WINDOW); 
  const [ previousActiveEditorWindow, setPreviousActiveEditorWindow ] = useState(null);

  const hasProjects = fileTree?.entries?.length > 0;
  const canAddFile = Boolean(hasProjects && selectedFolder);  // can only add a file if a target folder is selected
  const canDeleteFolder = Boolean(hasProjects && selectedFolder);  // can only delete a folder if a target folder is selected
  const canAddProjectFolder = Boolean(selectedFolder); // can only add a file if a target folder is selected

  console.log('debug: ', selectedPackage, activeEditorWindow);

  async function addProject(newProjectName) {
    onAddProject(newProjectName);
    updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
  }

  async function addProjectFolder(newFolderName) {
    onAddProjectFolder(newFolderName, selectedFolder)
    // go back to prev window
    updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
  }

  async function deployPackage(projectName, packageUrl) {

    await onDeploy(projectName, packageUrl);

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

  function backToPreviousWindow() {
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
          <DeployProjectButton
            onClick={
              () => {
                setSelectedPackage(null);
                updateActiveEditorWindow(EDITOR_WINDOWS.DEPLOY_WINDOW, activeEditorWindow)
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
            //updateActiveEditorWindow(EDITOR_WINDOWS.RENAME_FOLDER_WINDOW, activeEditorWindow);
          }}
          onFileRename={() => {
            //updateActiveEditorWindow(EDITOR_WINDOWS.RENAME_FILE_WINDOW, activeEditorWindow);
          }}
          onFolderSelect={setSelectedFolder}
          onPackageSelect={
            ({ name, url }) => {
              setSelectedPackage({ name, url });
              updateActiveEditorWindow(EDITOR_WINDOWS.DEPLOY_WINDOW, activeEditorWindow)
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
          <BlankWindow active={ activeEditorWindow === 'BLANK_WINDOW' } />
          <NoFileSelectedWindow active={ activeEditorWindow === 'NO_FILE_SELECTED_WINDOW' } />
          <NameProjectWindow
            active={ activeEditorWindow === 'NAME_PROJECT_WINDOW' } 
            onConfirm={ addProject }
            onCancel={ backToPreviousWindow } />
          <NameProjectFolderWindow
            projectName={selectedFolder?.project}
            active={ activeEditorWindow === 'NAME_PROJECT_FOLDER_WINDOW' } 
            onConfirm={ addProjectFolder }
            onCancel={ backToPreviousWindow } />
          <NameFileWindow 
            active={ activeEditorWindow === 'NAME_FILE_WINDOW' } 
            onConfirm={ addFile }
            onCancel={ backToPreviousWindow } />
          <DeployWindow
            active={ activeEditorWindow === 'DEPLOY_WINDOW' } 
            selectedPackage={ selectedPackage }
            onConfirm={ deployPackage }
            onCancel={ backToPreviousWindow } />
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
