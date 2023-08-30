import React, { useEffect, useState } from 'react';
import cn from 'classnames';

export function NameInput({ isOpen, onCancel, onConfirm, label='' }) {

  const [ name, setName ] = useState('');

  return isOpen ? (
    <label>
      <span>{label}:</span>
      <input
        onChange={(e) => setName(e.target.value) }
        value={name}
        title="choose name for your new file or folder" />
      <button onClick={ onCancel } >cancel</button>
      <button onClick={ 
        (e) => {
          onConfirm(name);
        }
      }>ok</button>
    </label>
  ) : null

}

export function DeleteFolderButton({ onDeleteFolder, disabled }) {
  return (
      <button
        onClick={ onDeleteFolder }
        disabled={ disabled }
        className="delete-folder fas fa-folder-minus"
        title="delete highlighted folder" />
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

function FileMenu({ AddFileButton, AddFolderButton, DeleteFolderButton, NewFileNameInput, NewFolderNameInput }) {
  return (
    <>
      <ul className="file-menu">
          <li><AddFolderButton /></li>
          <li><DeleteFolderButton /></li>
          <li><AddFileButton /></li>
          {/* <li><button className="upload-file fas fa-upload" title="upload a file"/></li> */}
      </ul>
      <NewFileNameInput />
      <NewFolderNameInput />
    </>
  )
}

export default FileMenu;
