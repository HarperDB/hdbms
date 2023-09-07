import React from 'react';
import cn from 'classnames';


// change event to onClick
export function DeleteFolderButton({ onDeleteFolder, disabled }) {
  return (
      <button
        onClick={ onDeleteFolder }
        disabled={ disabled }
        className="delete-folder fas fa-folder-minus"
        title="delete selected folder" />
  )
}

// change event to onClick
export function AddFolderButton({ onAddFolder }) {
  return (
      <button
        onClick={ onAddFolder }
        className="add-folder fas fa-folder-plus"
        title="add a new folder" />
  )
}

// change event to onClick
export function AddFileButton({ disabled, onAddFile }) {
  return (
      <button
        disabled={ disabled }
        onClick={ onAddFile }
        className="add-file fas fa-plus"
        title="add a new file" />
  )
}

// change event to onClick
export function DeleteFileButton({ onDeleteFile, disabled }) {
  return (
      <button
        onClick={ onDeleteFile }
        disabled={ disabled }
        className="delete-file fas fa-minus"
        title="delete selected file" />
  )
}

export function DeployProjectButton({ onClick }) {
  return (
      <button
        onClick={ onClick }
        className={
          cn("deploy-project fas fa-arrow-alt-circle-up")
        }
        title="deploy project" />
  )
}


function FileMenu({ children }) {
  return (
    <ul className="file-menu">
      {
        children.map(child => <li>{child}</li>)
      }
    </ul>
  )
}

export default FileMenu;
