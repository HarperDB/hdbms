import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import FileBrowser from './FileBrowser';
import FileMenu, { AddFileButton, AddFolderButton, DeleteFolderButton, DeleteFileButton, DeployProjectButton } from './FileMenu';
import EditorMenu, { SaveButton } from './EditorMenu';
import Editor from './Editor'; 
import EditorWindow, { EDITOR_WINDOWS, DeployWindow, BlankWindow, NoFileSelectedWindow, NameFileWindow, NameFolderWindow } from './EditorWindow';
import NameInput from './NameInput';

// setSelectedFile: this is for matching against fileTree for ui highlighting
// and it's for saving to server.

function WebIDE({ fileTree, onSave, onUpdate, onAddFile, onAddFolder, onFileSelect, onFileRename, onFolderRename, onDeleteFile, onDeleteFolder }) {

  const [ selectedFolder, setSelectedFolder ] = useState(null);
  const [ selectedFile, setSelectedFile ] = useState(null); // selectedFile = { content, path: /components/project/rest/of/path.js, project }
  const [ editingFileName, setEditingFileName ] = useState(false); 
  const [ editingFolderName, setEditingFolderName ] = useState(false); 
  const [ showDeployWindow, setShowDeployWindow ] = useState(false);
  const [ activeEditorWindow, setActiveEditorWindow ] = useState(EDITOR_WINDOWS.BLANK_WINDOW); 
  const [ previousActiveEditorWindow, setPreviousActiveEditorWindow ] = useState(null);

  console.log('web ide re-render folder path check', selectedFolder?.path);
  console.log('FILETREE: ', fileTree);

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

    console.log('add file check: ', fileInfo)
    // TODO: check filepath.
    setSelectedFile(fileInfo);
    updateActiveEditorWindow(EDITOR_WINDOWS.CODE_EDITOR_WINDOW, activeEditorWindow);
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
 
    // TODO: check filepath.
    const update = {
      ...selectedFile,
      content: updatedCode
    };

    console.log('update in memory code file check : ', update); 
    setSelectedFile(update);

  }
 
  return (
    <Row className="web-ide">
      <Col md="3" className="file-browser-container">
        <FileMenu>
          <AddFolderButton
            onAddFolder={() => {
              updateActiveEditorWindow(EDITOR_WINDOWS.NAME_FOLDER_WINDOW, activeEditorWindow);
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
            onClick={ () => updateActiveEditorWindow(EDITOR_WINDOWS.DEPLOY_WINDOW, activeEditorWindow) }
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
          onFileSelect={
            async (entry) => {
              console.log('on file select: ', entry);
              const { content } = await onFileSelect(entry);
              // TODO: check filepath.
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
                    onSave(selectedFile)
                  }
                } />
            )
          }
        />
        <EditorWindow>
          <BlankWindow active={ activeEditorWindow === 'BLANK_WINDOW' } />
          <NameFolderWindow
            active={ activeEditorWindow === 'NAME_FOLDER_WINDOW' } 
            onConfirm={ (folderName) => addFolder(folderName) }
            onCancel={ backToPreviousWindow } />
          <NameFileWindow 
            active={ activeEditorWindow === 'NAME_FILE_WINDOW' } 
            onConfirm={ addFile }
            onCancel={ backToPreviousWindow } />
          <DeployWindow active={ activeEditorWindow === 'DEPLOY_WINDOW' } />
          <NoFileSelectedWindow active={ activeEditorWindow === 'NO_FILE_SELECTED_WINDOW' } />
          <Editor active={ activeEditorWindow === 'CODE_EDITOR_WINDOW' } file={ selectedFile } onChange={ updateInMemoryCodeFile } />
        </EditorWindow>
      </Col>
    </Row>
  );
}

export default WebIDE;
