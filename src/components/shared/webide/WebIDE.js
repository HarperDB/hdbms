import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import FileBrowser from './FileBrowser';
import FileMenu, { AddFileButton, AddFolderButton, DeleteFolderButton, DeleteFileButton, DeployProjectButton } from './FileMenu';
import EditorMenu, { SaveButton } from './EditorMenu';
import Editor from './Editor'; 
import EditorWindow, { EDITOR_WINDOWS, DeployWindow, BlankWindow, NoFileSelectedWindow, NameFileWindow, NameFolderWindow } from './EditorWindow';
import NameInput from './NameInput';


function WebIDE({ fileTree, onSave, onUpdate, onAddFile, onAddFolder, onFileSelect, onFileRename, onFolderRename, onDeleteFile, onDeleteFolder }) {

  const [ selectedFolder, setSelectedFolder ] = useState(null);
  const [ selectedFile, setSelectedFile ] = useState(null); // selectedFile = { content, path, project }
  const [ editingFileName, setEditingFileName ] = useState(false); 
  const [ editingFolderName, setEditingFolderName ] = useState(false); 
  const [ showDeployWindow, setShowDeployWindow ] = useState(false);
  const [ activeEditorWindow, setActiveEditorWindow ] = useState(EDITOR_WINDOWS.BLANK_WINDOW); 
  const [ previousActiveEditorWindow, setPreviousActiveEditorWindow ] = useState(null);

  const hasProjects = fileTree?.entries?.length > 0;
  const canAddFile = Boolean(hasProjects && selectedFolder);  // can only add a file if a target folder is selected
  const canDeleteFolder = Boolean(hasProjects && selectedFolder);  // can only add a file if a target folder is selected

  async function addFolder(newFolderName) {
    onAddFolder(newFolderName, selectedFolder)
    // go back to prev window
    updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
  }

  async function addFile(newFilename) {
    const fileInfo = await onAddFile(newFilename, selectedFolder);
    // show file in editor window.
    setSelectedFile(fileInfo);
    updateActiveEditorWindow(EDITOR_WINDOWS.CODE_EDITOR, activeEditorWindow);
  }

  function updateActiveEditorWindow(to, from) {
    setActiveEditorWindow(to);
    setPreviousActiveEditorWindow(from);
  }

  function backToPreviousWindow() {
    updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
  }

  // updates current in memory code
  function updateInMemoryCodeFile(updatedCode) {

    setSelectedFile({
      ...selectedFile,
      content: updatedCode
    });

  }
 
  return (
    <Row className="web-ide">
      <Col md="3" className="file-browser-container">
        <FileMenu>
          <AddFolderButton
            onAddFolder={() => {
              updateActiveEditorWindow(EDITOR_WINDOWS.NAME_FOLDER, activeEditorWindow);
            }} />
          <DeleteFolderButton
            disabled={ !canDeleteFolder }
            onDeleteFolder={
              () => {
                onDeleteFolder(selectedFolder);
                setSelectedFile(null);
                setSelectedFolder(null);
              }
            } />
          <AddFileButton
            onAddFile={() => {
              updateActiveEditorWindow(EDITOR_WINDOWS.NAME_FILE, activeEditorWindow);
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
              }
            } />
          <DeployProjectButton
            onClick={ () => updateActiveEditorWindow(EDITOR_WINDOWS.DEPLOY, activeEditorWindow) }
            />
        </FileMenu>
        <FileBrowser
          files={ fileTree }
          root={ fileTree.path }
          selectedFile={ selectedFile?.path }
          selectedFolder={ selectedFolder }
          onFolderRename={() => {
            updateActiveEditorWindow(EDITOR_WINDOWS.RENAME_FOLDER, activeEditorWindow);
          }}
          onFileRename={() => {
            updateActiveEditorWindow(EDITOR_WINDOWS.RENAME_FILE, activeEditorWindow);
          }}
          onFolderSelect={setSelectedFolder}
          onFileSelect={
            async (entry) => {
              const { content } = await onFileSelect(entry);
              setSelectedFile({
                ...entry,
                content
              });
              updateActiveEditorWindow(EDITOR_WINDOWS.CODE_EDITOR, activeEditorWindow);
            } 
          } />
      </Col>
      <Col className="code-editor-container">
        <EditorMenu
          onSave={
            async () => {
              await onSave(selectedFile)
            }
          }
          SaveButton={ 
            () => ( 
              <SaveButton
                disabled={ !selectedFile }
                onSave={
                  () => onSave(selectedFile)
                } />
            )
          }
        />
        <EditorWindow
          activeWindow={ activeEditorWindow }
          BlankWindow={ BlankWindow }
          NameFolderWindow={ 
            () => (
              <NameFolderWindow
                onConfirm={ (folderName) => addFolder(folderName) }
                onCancel={ backToPreviousWindow } />
            )
          }
          NameFileWindow={
            () => {
              <NameFileWindow 
                onConfirm={ addFile }
                onCancel={ backToPreviousWindow } />
            }
          }
          DeployWindow={ DeployWindow }
          NoFileSelectedWindow={ NoFileSelectedWindow }
          CodeEditor={
            () => <Editor file={ selectedFile } onChange={ console.log }/>
          }
          />
      </Col>
    </Row>
  );
}

export default WebIDE;
