import React, { useState } from 'react';
import { Card } from 'reactstrap';
import NameInput from './NameInput';

export const EDITOR_WINDOWS = {
  DEFAULT_WINDOW: 'BLANK_WINDOW',
  BLANK_WINDOW: 'BLANK_WINDOW',
  CODE_EDITOR_WINDOW: 'CODE_EDITOR_WINDOW',
  NAME_FILE_WINDOW: 'NAME_FILE_WINDOW',
  NAME_PROJECT_WINDOW: 'NAME_PROJECT_WINDOW',
  NAME_PROJECT_FOLDER_WINDOW: 'NAME_PROJECT_FOLDER_WINDOW',
  RENAME_FILE_WINDOW: 'RENAME_FILE_WINDOW',
  RENAME_FOLDER_WINDOW: 'RENAME_FOLDER_WINDOW',
  NO_FILE_SELECTED_WINDOW: 'NO_FILE_SELECTED_WINDOW',
  DEPLOY_WINDOW: 'DEPLOY_WINDOW',
  PACKAGE_DETAILS_WINDOW: 'PACKAGE_DETAILS_WINDOW'
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

export function NameProjectWindow({ active, onConfirm, onCancel }) {
  return !active ? null : (
    <NameInput
      label="New Project Name"
      onEnter={ onConfirm }
      onConfirm={ onConfirm }
      onCancel={ onCancel }
    />
  );
}

export function NameProjectFolderWindow({ active, onConfirm, onCancel, projectName }) {
  return !active ? null : (
    <NameInput
      label={`New Subdirectory Name for project '${projectName}'`}
      onConfirm={ onConfirm }
      onEnter={ onConfirm }
      onCancel={ onCancel }
    />
  );
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

export function PackageDetailsWindow({ active, packageDetails }) {
  
  if (!active) {
    return null;
  }

  return (
    <div>
      <ul>
        <li>
          name: { packageDetails.name }
        </li>
        <li>
          url: { packageDetails.url }
        </li>
      </ul>
    </div>
  );

}

export function DeployWindow({ active, onConfirm, onCancel }) {

  const [ packageName, setPackageName ] = useState('');
  const [ packageUrl, setPackageUrl ] = useState('');

  function callOnConfirm() {

    if (!(packageName.trim() && packageUrl.trim())) {
      console.error('invalid package name and/or url');
      return;
    }

    onConfirm(packageName, packageUrl); 

  }

  function updatePackageName(e) {
    setPackageName(e.target.value)
  }

  function updatePackageUrl(e) {
    setPackageUrl(e.target.value)
  }

  return !active ? null : (
    <div className="deploy-form">
      <label className="instructins">Deploy a component from an external package location:</label>
      <label>
        <span>Package name</span>:
        <input
          autoFocus 
          value={packageName}
          onChange={ updatePackageName }
          placeholder="name your external component" />
      </label>
      <label>
        <span>External Package URL</span>:
        <input
          value={packageUrl}
          onChange={ updatePackageUrl }
          placeholder="url to external component" />
      </label>
      <button onClick={ onCancel }>Cancel</button>
      <button onClick={ callOnConfirm }>Deploy</button>
    </div>
  )
}

export default function EditorWindow({ children }) {
  return <Card className="editor-window">
  { children } 
  </Card>
}
