import React from 'react';
import cn from 'classnames';
import { v4 as uuid } from 'uuid';


export function DeleteFolderButton({ onDeleteFolder, disabled }) {
  return (
    <button
      onClick={ onDeleteFolder }
      disabled={ disabled }
      className="delete-folder fas fa-folder-minus"
      title="delete selected folder" />
  )
}

export function AddProjectFolderButton({ onAddProjectFolder, disabled }) {
  return (
    <button
      disabled={ disabled }
      onClick={ onAddProjectFolder }
      className="add-folder fas fa-folder-plus"
      title={`add a new subdirectory to your project`} />
  )
}

export function AddProjectButton({ disabled, onAddProject }) {
  return (
    <button
      disabled={ disabled }
      onClick={ onAddProject }
      className="add-project fas fa-file-code"
      title="add a new project" />
  );
}

export function AddFileButton({ disabled, onAddFile }) {
  return (
    <button
      disabled={ disabled }
      onClick={ onAddFile }
      className="add-file fas fa-plus"
      title="add a new file" />
  )
}

export function DeleteFileButton({ onDeleteFile, disabled }) {
  return (
      <button
        onClick={ onDeleteFile }
        disabled={ disabled }
        className="delete-file fas fa-minus"
        title="delete selected file" />
  )
}

export function InstallPackageButton({ onClick }) {
  return (
      <button
        onClick={ onClick }
        className={
          cn("install-package fas fa-cloud-download-alt")
        }
        title="install external package from url or NPM package spec" />
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
