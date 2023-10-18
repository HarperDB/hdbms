import React from 'react';
import cn from 'classnames';
import { v4 as uuid } from 'uuid';


export function DeleteFolderButton({ onClick, disabled }) {
  return (
    <button
      onClick={ onClick }
      disabled={ disabled }
      className="delete-folder-icon fas fa-folder-minus"
      title="Delete selected project, folder or package" />
  )
}

export function AddProjectFolderButton({ onAddProjectFolder, disabled, text="" }) {
  return (
    <button
      disabled={ disabled }
      onClick={ onAddProjectFolder }
      className="add-folder-icon fas fa-folder-plus"
      title={`Add a new subdirectory to your project`} />
  )
}


export function InstallPackageButton({ onClick, text="" }) {
  return (
    <button
      onClick={ onClick }
      className={
        cn("install-package-icon")
      }
      title="Install external package from url or NPM package spec">
        <i className="fas fa-share-alt" />
        { text && <span style={{color: 'white'}}> {text}</span> }
    </button>
  )
}


export function AddProjectButton({ disabled=false, onAddProject, text="" }) {
  return (
    <button
      disabled={ disabled }
      onClick={ onAddProject }
      className="add-project-icon"
      title="Add a new project">
        <i className="fas fa-folder-plus" />
        { text && <span style={{color: 'white'}}> {text}</span> }
    </button>
  );
}

export function AddFileButton({ disabled, onAddFile }) {
  return (
    <button
      disabled={ disabled }
      onClick={ onAddFile }
      className="add-file-icon fas fa-plus"
      title="Add a new file" />
  )
}

export function DeleteFileButton({ onClick, disabled }) {
  return (
      <button
        onClick={ onClick }
        disabled={ disabled }
        className="delete-file-icon fas fa-minus"
        title="Delete selected file" />
  )
}

function FileMenu({ children }) {
  return (
    <ul className="file-menu">
      {
        children.map(child => <li key={ uuid() }>{child}</li>)
      }
    </ul>
  )
}

export default FileMenu;
