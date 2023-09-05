import React from 'react';


export function DeleteFolderButton({ onDeleteFolder, disabled }) {
  return (
      <button
        onClick={ onDeleteFolder }
        disabled={ disabled }
        className="delete-folder fas fa-folder-minus"
        title="delete selected folder" />
  )
}

export function AddFolderButton({ onAddFolder }) {
  return (
      <button
        onClick={ onAddFolder }
        className="add-folder fas fa-folder-plus"
        title="add a new folder" />
  )
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


function FileMenu({ children }) {
  console.log('children', children);
  console.log(children);
  return (
    <ul className="file-menu">
      {
        children.map(child => <li>{child}</li>)
      }
    </ul>
  )
}

export default FileMenu;
