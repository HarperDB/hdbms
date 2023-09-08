import React from 'react';
import { Card } from 'reactstrap';
import NameInput from './NameInput';

export const EDITOR_WINDOWS = {
  DEFAULT_WINDOW: 'BLANK_WINDOW',
  BLANK_WINDOW: 'BLANK_WINDOW',
  CODE_EDITOR_WINDOW: 'CODE_EDITOR_WINDOW',
  NAME_FILE_WINDOW: 'NAME_FILE_WINDOW',
  NAME_FOLDER_WINDOW: 'NAME_FOLDER_WINDOW',
  RENAME_FILE_WINDOW: 'RENAME_FILE_WINDOW',
  RENAME_FOLDER_WINDOW: 'RENAME_FOLDER_WINDOW',
  NO_FILE_SELECTED_WINDOW: 'NO_FILE_SELECTED_WINDOW',
  DEPLOY_WINDOW: 'DEPLOY_WINDOW'
};

export function DeployWindow({ active, onDeploy }) {
  return !active ? null : <div onClick={ onDeploy }>deploy window</div>
}

export function BlankWindow({ active }) {
  return !active ? null : (
    <div className="blank-editor-window">
    Select a File on the left.
    </div>
  )
}

export function NoFileSelectedWindow({ active }) {
  return !active ? null : (
    <div>
      No file selected. Please select or create ( <i className="fas fa-plus" /> ) a file using the menu on the left. 
    </div>
  )
}

export function NameFileWindow({ active, onConfirm, onCancel }) {
  return !active ? null : (
    <NameInput
      label="New File Name"
      onEnter={ onConfirm }
      onConfirm={ onConfirm }
      onCancel={ onCancel }
    />
  );
}

export function NameFolderWindow({ active, onConfirm, onCancel }) {
  return !active ? null : (
    <NameInput
      label="New Folder Name"
      onConfirm={ onConfirm }
      onEnter={ onConfirm }
      onCancel={ onCancel }
    />
  );
}

/*
function RenameFileWindow() {
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

function RenameFolderWindow() {
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
*/




function EditorWindow({ children }) {
  return <Card className="editor-window">
  { children } 
  </Card>
}

function EditorWindowOld({ activeWindow, BlankWindow, CodeEditor, RenameFileWindow, RenameFolderWindow, /* RenameFile, RenameFolder, */ DeployWindow, NoFileSelected }) {

  let CurrentWindow = null;

  if (activeWindow === EDITOR_WINDOWS.BLANK_WINDOW) {
    CurrentWindow = BlankWindow;
  } else if (activeWindow === EDITOR_WINDOWS.CODE_EDITOR) {
    CurrentWindow = CodeEditor;
  } else if (activeWindow === EDITOR_WINDOWS.FILENAME_DIALOG) {
    CurrentWindow = RenameFileWindow;
    /*
  } else if (activeWindow === EDITOR_WINDOWS.RENAME_FILE) {
    CurrentWindow = RenameFileWindow;
  } else if (activeWindow === EDITOR_WINDOWS.RENAME_FOLDER) {
    CurrentWindow = RenameFolderWindow;
    */
  } else if (activeWindow === EDITOR_WINDOWS.NAME_FILE) {
    CurrentWindow = NameFileWindow;
  } else if (activeWindow === EDITOR_WINDOWS.NAME_FOLDER) {
    CurrentWindow = NameFolderWindow;
  } else if (activeWindow === EDITOR_WINDOWS.NO_FILE_SELECTED) {
    CurrentWindow = NoFileSelectedWindow;
  } else if (activeWindow === EDITOR_WINDOWS.DEPLOY) {
    CurrentWindow = DeployWindow;
  }

  return (
    <Card className="editor-window">
    { <CurrentWindow /> }
    </Card>
  )

}



export default EditorWindow;
