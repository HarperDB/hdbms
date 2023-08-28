import React, { useEffect, useState } from 'react';
import cn from 'classnames';

export function NewFileNameInput({ settingName, onSetNewFileName }) {

  const [ name, setName ] = useState('untitled');

  return (
    <label>
      filename:
      <input
        onChange={(e) => setName(e.target.value) }
        value={name}
        disabled={settingName}
        title="choose name for your new file or folder" />
      <button>cancel</button>
      <button onClick={ (e) => onSetNewFileName(name) }>ok</button>
    </label>
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

function FileMenu({ AddFileButton, AddFolderButton, NewFileNameInput }) {
  return (
    <>
      <ul className="file-menu">
          <li><AddFolderButton /></li>
          <li><AddFileButton /></li>
          {/* <li><button className="upload-file fas fa-upload" title="upload a file"/></li> */}
      </ul>
      <NewFileNameInput />
    </>
  )
}

export default FileMenu;
