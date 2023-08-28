import React, { useEffect, useState } from 'react';
import cn from 'classnames';

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

function FileMenu({ AddFileButton, AddFolderButton }) {
  return (
      <ul className="file-menu">
          <li><AddFolderButton /></li>
          <li><AddFileButton /></li>
          {/* <li><button className="upload-file fas fa-upload" title="upload a file"/></li> */}
      </ul>
  )
}

export default FileMenu;
