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

export function DeployWindow({ active, onConfirm, onCancel }) {
  return !active ? null : (
    <NameInput
      label="Deploy from an external location"
      onConfirm={ onConfirm }
      onCancel={ onCancel }
    />
  )
}

function EditorWindow({ children }) {
  return <Card className="editor-window">
  { children } 
  </Card>
}

export default EditorWindow;
