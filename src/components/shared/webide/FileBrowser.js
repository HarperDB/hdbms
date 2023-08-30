import React, { useEffect, useState } from 'react';
import { Input } from 'reactstrap';
import { Link } from 'react-router';

import setComponentFile from '../../../functions/api/instance/setComponentFile.js'

import cn from 'classnames';


function NoProjects() {
  return (
    <div className="no-projects">
      <p>You have no HarperDB applications yet. Click the <i className="fas fa-folder-plus" /> button in the menu above to create your first application!</p>
      <p>See the <a href="https://docs.harperdb.io" target="_blank"> documentation </a> for more info on HarperDB Applications.
      </p>
    </div>
  )
}

function directorySortComparator(a, b) {

  // directories first, then flat files sorted
  // ascending, alphanumerically
  const A = +Boolean(a.entries);
  const B = +Boolean(b.entries);

  return A === B ? a.name.localeCompare(b.name) : B - A;

}

const isDirectory = (entry) => Boolean(entry.entries);

function FolderIcon({ isOpen, toggleClosed }) {
  const folderClassName = isOpen ? 'fa-folder-open' : 'fa-folder';
  return <i onClick={toggleClosed} className={cn(`folder-icon fas ${folderClassName}`)} />;
}

function FiletypeIcon() {
  return <i className={ cn('file-icon fab fa-js') } />;
}

function File({ directoryEntry, selectedFile, selectedDirectory, onFileSelect, onFileRename, onDirectorySelect, userOnSelect, toggleClosed, Icon }) {

  const [ editing, setEditing ] = useState(false);
  const [ newFileName, setNewFileName ] = useState(directoryEntry.name);
  const isDir = isDirectory(directoryEntry);
  // file receives open/close toggle func from
  // parent. if it's a dir, calls toggle func on click
  // if it's a flat file, calls onFileSelect so
  // parent can get file content.


  function noOp() {
    // TODO: figure out how to handle keyboard events properly.
    // for now, use this to avoid react a11y errors.
  }

  async function handleOnBlur(e) {

    // blur means the file name has possibly changed:
    // - check if new name differs
    //  - if so, flip back to filename+icon view
    //  - call setComponentFile, call getComponentFiles to reload tree.
    //    - i don't think we need to update the fileEntry value, since reload will take care of that.
    //    - but maybe? server takes a minute, the ui will lag. is that a bad thing?
    setEditing(false);
    onFileRename(directoryEntry);
    //reloadFileTree();
  }

  function handleFilenameClick(e) {

    const isSingleClick = e.detail === 1; 
    const isDoubleClick = e.detail === 2;

    if (isSingleClick) {
      if (isDir) {
        // one click on dir name toggles selected / highlighted state / ui
        const alreadySelected = directoryEntry?.path === selectedDirectory?.path;
        onDirectorySelect(alreadySelected ? null : directoryEntry);
      } else {
        // one click on file name sets it to selected / highlighted
        // AND retrieves file content
        onFileSelect(directoryEntry);
      }

    } else if (isDoubleClick) {
      if (isDir) {
        // TODO: double click on dirname renames it
      } else {
        // double click on filename renames it
        onFileRename(directoryEntry);
      }
    }
  }

  const isFileSelected = directoryEntry.path === selectedFile;
  const isFolderSelected = directoryEntry.path === selectedDirectory?.path;

  return (
    editing ?
      <Input
       className="filename-input"
       onChange={ (e) => setNewFileName(e.target.value) }
       onBlur={ handleOnBlur }
       value={ newFileName } />
      : <button
        className={
          cn('file', {
            'file-selected': isFileSelected,
            'folder-selected': isFolderSelected
          })
        }
        onKeyDown={ noOp } >
          <Icon className="filename-icon" />
          <span onClick={ handleFilenameClick } className="filename-text">{ directoryEntry.name }</span>
      </button>
  );

}

function Directory({ directoryEntry, userOnSelect, onDirectorySelect, onFileSelect, onFileRename, selectedFile, selectedDirectory }) {

  const [ open, setOpen ] = useState(true);

  const entries = [...(directoryEntry.entries || [])].sort(directorySortComparator);

  // FolderIcon is a func so we can give it open args now, but instantiate it later.
  const icon = directoryEntry.entries ?
     () => FolderIcon({ isOpen: open,  toggleClosed: () => setOpen(!open) })
     : FiletypeIcon

  const isSelected = directoryEntry.path === selectedDirectory?.path;

  return (
    <>
    {
      directoryEntry.name !== 'components' ?
        <li key={directoryEntry.key} className={cn('folder-container')}>
          <File
            Icon={ icon }
            selectedFile={selectedFile}
            selectedDirectory={selectedDirectory}
            directoryEntry={directoryEntry}
            onFileRename={onFileRename}
            onFileSelect={onFileSelect}
            onDirectorySelect={onDirectorySelect}
            userOnSelect={userOnSelect} />
        </li>
        : null
    }

      {
        entries.map((entry) => (
          <li key={entry.key}>
            <ul className={cn(`folder`, {
              'folder-contents-open': open,
              'folder-contents-closed': !open
            })}>
              <Directory
                selectedFile={selectedFile}
                selectedDirectory={selectedDirectory}
                directoryEntry={entry}
                onFileSelect={onFileSelect}
                onFileRename={onFileRename}
                onDirectorySelect={onDirectorySelect}
                userOnSelect={userOnSelect} />
            </ul>
          </li>
        ))
      }
    </>

  )

}

// A recursive directory tree representation
function FileBrowser({ files, userOnSelect, onFileSelect, onFileRename, onDirectorySelect, selectedFile, selectedDirectory }) {

  if (!files) return null;

  return files.entries.length ? (
    <ul className="file-browser">
      <Directory
        selectedFile={selectedFile}
        selectedDirectory={selectedDirectory}
        onFileSelect={onFileSelect}
        onFileRename={onFileRename}
        onDirectorySelect={onDirectorySelect}
        userOnSelect={userOnSelect}
        directoryEntry={files} />
    </ul>
  ) : <NoProjects /> 


}

export default FileBrowser
