import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import FileBrowser from './FileBrowser';
import FileMenu, { AddFileButton, AddFolderButton, DeleteFolderButton, DeleteFileButton, DeployProjectButton } from './FileMenu';
import EditorMenu, { SaveButton } from './EditorMenu';
import Editor from './Editor'; 
import EditorWindow, { EDITOR_WINDOWS } from './EditorWindow';
import NameInput from './NameInput';


function WebIDE({ fileTree, onSave, onUpdate, onAddFile, onAddFolder, onFileSelect, onFileRename, onFolderRename, onDeleteFile, onDeleteFolder }) {

  const [ selectedFolder, setSelectedFolder ] = useState(null);
  const [ selectedFile, setSelectedFile ] = useState(null); // selectedFile = { content, path, project }
  const [ editingFileName, setEditingFileName ] = useState(false); 
  const [ editingFolderName, setEditingFolderName ] = useState(false); 
  const [ showDeployWindow, setShowDeployWindow ] = useState(false);
  const [ activeEditorWindow, setActiveEditorWindow ] = useState(EDITOR_WINDOWS.BLANK_WINDOW); 
  const [ previousActiveEditorWindow, setPreviousActiveEditorWindow ] = useState(null);

  console.log('active editor window: ',  activeEditorWindow);

  const hasProjects = fileTree?.entries?.length > 0;
  const canAddFile = Boolean(hasProjects && selectedFolder);  // can only add a file if a target folder is selected
  const canDeleteFolder = Boolean(hasProjects && selectedFolder);  // can only add a file if a target folder is selected

  function updateActiveEditorWindow(to, from) {
    setActiveEditorWindow(to);
    setPreviousActiveEditorWindow(from);
  }

  // updates current in memory code
  function updateInMemoryCodeFile(updatedCode, selectedFile) {

    setSelectedFile({
      ...selectedFile,
      content: updatedCode
    });

  }

  // WINDOWS
  function DeployWindow({ onDeploy }) {
    return <div onClick={ onDeploy }>deploy window</div>
  }

  function BlankWindow() {
    return (
      <div className="blank-editor-window">
      Select a File on the left.
      </div>
    )
  }

  function NoFileSelected() {
    return (
      <div>
        No file selected. Please select or create ( <i className="fas fa-plus" /> ) a file using the menu on the left. 
      </div>
    )
  }

  function NameFile() {
    return (
      <NameInput
        label="New File Name"
        onConfirm={
          async (newFilename) => {
            const fileInfo = await onAddFile(newFilename, selectedFolder);
            // show file in editor window.
            setSelectedFile(fileInfo);
            updateActiveEditorWindow(EDITOR_WINDOWS.CODE_EDITOR, activeEditorWindow);
          }
        }
        onCancel={() => {
          updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
        }}
        onEnter={
          (newFilename) => {
            onAddFile(newFilename, selectedFolder)
            // go back to prev window
            updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
          }
        }
      />
    );
  }

  function NameFolder() {
    return (
      <NameInput
        label="New Folder Name"
        onConfirm={
          (newFolderName) => {
            onAddFolder(newFolderName, selectedFolder)
            // go back to prev window
            updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
          }
        }
        onCancel={() => {
          updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
        }}
        onEnter={
          (newFolderName) => {
            onAddFolder(newFolderName, selectedFolder)
            // go back to prev window
            updateActiveEditorWindow(previousActiveEditorWindow, activeEditorWindow);
          }
        }
      />
    );
  }

  function RenameFile() {
    return (
      <NameInput
            label={`Please Choose a New Filename for '${selectedFile?.name}'`}
            value={selectedFile?.name}
            onBlur={()=>{}}
            onConfirm={
              (newName) => {
                onFileRename(newName, selectedFile);
              }
            }
            enabled={false}
            onCancel={() => {}} />
    );
  }

  function RenameFolder() {
    return (
      <NameInput
        label={`Please Choose a New Folder Name for 'this'`}
        value={selectedFolder?.name}
        onConfirm={ 
          (newName) => {
            onFolderRename(newName, selectedFolder)
          }
        }
        onBlur={() => {}}
        onCancel={() => {}} />
    );
  }

  function FilenameDialog() {

    return (
      <div className="filename-dialog">
     
      </div>
    )
  }

  return (
    <Row className="web-ide">
      <Col md="3" className="file-browser-container">
        <FileMenu>
          <AddFolderButton onAddFolder={
            () => {
              updateActiveEditorWindow(EDITOR_WINDOWS.NAME_FOLDER, activeEditorWindow);
            }
          } />
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
            onAddFile={
              () => {
                updateActiveEditorWindow(EDITOR_WINDOWS.NAME_FILE, activeEditorWindow);
              }
            }
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
          <DeployProjectButton onClick={ 
            () => updateActiveEditorWindow(EDITOR_WINDOWS.DEPLOY, activeEditorWindow)
          } />
        </FileMenu>
        <FileBrowser
          files={ fileTree }
          root={ fileTree.path }
          selectedFile={selectedFile?.path}
          selectedFolder={selectedFolder}
          onFolderRename={
            () => {
              console.log('to: ', EDITOR_WINDOWS.FILENAME_DIALOG);
              setActiveEditorWindow(EDITOR_WINDOWS.RENAME_FOLDER);
              console.log('folder rename not available in 4.2');
            }
          }
          onFileRename={() => {
            console.log('to: ', EDITOR_WINDOWS.FILENAME_DIALOG);
            setActiveEditorWindow(EDITOR_WINDOWS.RENAME_FILE);
          }}
          onFolderSelect={setSelectedFolder}
          onFileSelect={
            async (entry) => {
              console.log('to: ', EDITOR_WINDOWS.CODE_EDITOR);
              const { content } = await onFileSelect(entry);
              setSelectedFile({
                ...entry,
                content
              });
              setActiveEditorWindow(EDITOR_WINDOWS.CODE_EDITOR);
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
          NameFolder={ NameFolder }
          NameFile={ NameFile }
          RenameFile={ RenameFile }
          RenameFolder={ RenameFolder }
          FilenameDialog={ FilenameDialog }
          DeployWindow={ DeployWindow }
          NoFileSelected={ NoFileSelected }
          CodeEditor={
            () => (
              <Editor
                file={selectedFile}
                onChange={
                  (updatedCode) => {
                    updateInMemoryCodeFile(updatedCode, selectedFile);
                  }
                } />
            )
          }
          />
      </Col>
    </Row>
  );
}

export default WebIDE;
