import React, { useState, useEffect } from 'react';
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
  DEPLOY_COMPONENT_WINDOW: 'DEPLOY_COMPONENT_WINDOW',
  INSTALL_PACKAGE_WINDOW: 'INSTALL_PACKAGE_WINDOW',
  PACKAGE_DETAILS_WINDOW: 'PACKAGE_DETAILS_WINDOW'
};

export function BlankWindow({ active, fileTree }) {
  return !active ? null : (
    <div className="blank-editor-window">
    {
      fileTree.entries?.length ? 'Please create or select a file on the left' : 'Please create a project on the left'
    }
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

export function DeployComponentWindow({ active, project, onConfirm, onCancel, deployTargets=[] }) {

  const [ selectedTarget, setSelectedTarget ] = useState(deployTargets[0] || null);

  if (!active || !project)
    return null;

  function updateSelectedTarget(e) {

    const match = deployTargets.find(t => t.instance.instance_name === e.target.value);
    setSelectedTarget(match);

  }

  return (
    <div className="deploy-component-window">
      <h3>Deploy to a cloud instance</h3>
      Select a deploy target below to deploy <span className="deploy-component-project-name">{ project.name }</span> to another HarperDB instance
      <br />
      <br />
      <select
        defaultValue="select a deploy target"
        autoFocus
        onChange={ updateSelectedTarget }
        name="deploy-targets"
        id="deploy-targets">
        {
          deployTargets.map(target => (
              <option key={target.instance.url} value={target.instance.instance_name}>
                {target.instance.instance_name} - {target.instance.url}
              </option>
            )
          )
        }
      </select>
      <br />
      <br />
      <div>
        <button
        disabled={ !selectedTarget }
        onClick={
          () => {
            onConfirm(project, selectedTarget);
          }
        }>Deploy</button>
      </div>
      <div>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

export function InstallPackageWindow({ active, selectedPackage, reinstallable, onConfirm, onCancel, onPackageChange }) {

  const [ url, tag ] = selectedPackage?.url?.split('#') || [];
  const [ packageName, setPackageName ] = useState(selectedPackage?.name || '');
  const [ packageUrl, setPackageUrl ] = useState(url || '');
  const [ releaseTag, setReleaseTag ] = useState(tag || ''); 

  console.log({packageName, packageUrl})

  useEffect(() => {
     let [ urlPart, tagPart ] = selectedPackage?.url?.split('#') || [];
      setPackageUrl(urlPart);
      setReleaseTag(tagPart);
  }, [selectedPackage?.url]);

  // FIXME: is this the right way to use useEffect here?
  // keeps controlled inputs in sync with selectedPackage changes from 
  // parent component.
  useEffect(() => {
    setPackageName(selectedPackage?.name);
    setPackageUrl(selectedPackage?.url);
  }, [selectedPackage])

  if (!active) {
    return null;
  }

  function callOnConfirm() {

    if (!(packageName.trim() && packageUrl.trim())) {
      // this should be a ui warning in the remote install window.
      console.error('invalid package name and/or url');
      return;
    }

    const validCharsRE = /^[a-zA-Z0-9-_]+$/; 
    if (!(validCharsRE).test(packageName)) {
      console.error(' Project name can only contain alphanumeric, dash and underscores characters');
      return;
    }

    onConfirm(packageName, `${packageUrl}${releaseTag ? `#${releaseTag}` : ''}`); 

  }

  function updatePackageName(e) {
    setPackageName(e.target.value)
  }

  function updatePackageUrl(e) {
    setPackageUrl(e.target.value)
  }

  function updateReleaseTag(e) {
    setReleaseTag(e.target.value);
  }

  return (
    <div className="install-package-form">
      {
        reinstallable ?
          <label className="instructions">Reinstall {selectedPackage?.name} from npm or an external URL:</label> :
          <label className="instructions">Install a package component from an external URL:</label>
      }
      <label>
        <span>Package name</span>:
        <input
          autoFocus 
          value={ packageName }
          onChange={ updatePackageName }
          placeholder="name your external component" />
      </label>
      <label>
        <span>External Package URL</span>:
        <input
          value={ packageUrl }
          onChange={ updatePackageUrl }
          placeholder="url to external component" />
      </label>
      <label>
        <span>Tag</span>:
        <input
          value={ releaseTag }
          onChange={ updateReleaseTag }
          placeholder="0.0.1" />
      </label>
      <button
        onClick={ callOnConfirm }
        disabled={ !(packageName && packageUrl) }>{reinstallable ? 'Re-Install' : 'Install' } External Package</button>
      <button onClick={ onCancel }>Cancel</button>
    </div>
  )
}

export default function EditorWindow({ children }) {
  return <Card className="editor-window">
  { children } 
  </Card>
}
