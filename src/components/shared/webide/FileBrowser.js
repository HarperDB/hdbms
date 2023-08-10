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

// TODO:
// keyboard events are buggy
// get rid of button outline
// proper filetype icons
// theming
// test at greater scale

function directorySortComparator(a, b) {

  // directories first, then flat files sorted
  // ascending, alphanumerically
  const A = +Boolean(a.entries);
  const B = +Boolean(b.entries);

  return A === B ? a.name.localeCompare(b.name) : B - A;

}

const isDirectory = (entry) => Boolean(entry.entries);

function FolderIcon({ isOpen }) {
  const folderClassName = isOpen ? 'fa-folder-open' : 'fa-folder';
  return <i className={cn(`folder-icon fas ${folderClassName}`)} />;
}

function FiletypeIcon() {
  return <i className={ cn('file-icon fab fa-js') } />;
}

function File({ directoryEntry, selectedFile, selectedDirectory, onFileSelect, onFileRename, onDirectorySelect, userOnSelect, toggleClosed, Icon }) {

  const [ editing, setEditing ] = useState(false);
  const [ newFileName, setNewFileName ] = useState(directoryEntry.name);
  // file receives open/close toggle func from
  // parent. if it's a dir, calls toggle func on click
  // if it's a flat file, calls onFileSelect so
  // parent can get file content.


  function noOp() {
    // TODO: figure out how to handle keyboard events properly.
    // for now, use this to avoid react a11y errors.
  }

  function handleClick(e) {

    // Note: preferring this over handleDoubleClick, as that will fire
    // 2x for each single click, and then again for the double.

    // single click
    if (e.detail === 1) {
      handleFileSelection()
    // double click
    } else if (e.detail === 2 && !editing) {
      setEditing(true);
    }
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
    reloadFileTree();
    console.log('value of blurred input: ',  e.target.value);
    console.log('new file name state: ',  newFileName);
  }

  function handleFileSelection() {

    const isDir = isDirectory(directoryEntry);
    if (isDir) {
      toggleClosed();
      onDirectorySelect(directoryEntry.path);
    } else {
      userOnSelect(directoryEntry);
      onFileSelect(directoryEntry);
    }

  }

  const isFileSelected = directoryEntry.path === selectedFile;
  const isFolderSelected = directoryEntry.path === selectedDirectory;

  return (
    editing ?
      <Input
       className="filename-input"
       onChange={ (e) => setNewFileName(e.target.value) }
       onBlur={ handleOnBlur }
       value={ newFileName } />
      : <button
        className={cn("file", {
          'file-selected': isFileSelected,
          'folder-selected': isFolderSelected
        })}
        onClick={ handleClick }
        onKeyDown={ noOp } >
          <Icon className="filename-icon" />
          <span className="filename-text">{ directoryEntry.name }</span>
      </button>
  )

}

function Directory({ directoryEntry, userOnSelect, onDirectorySelect, onFileSelect, onFileRename, selectedFile, selectedDirectory }) {

  const [ open, setOpen ] = useState(true);

  const entries = [...(directoryEntry.entries || [])].sort(directorySortComparator);

  // FolderIcon is a func so we can give it open args now, but instantiate it later.
  const icon = directoryEntry.entries ?
     () => FolderIcon({ isOpen: open })
     : FiletypeIcon

  const isSelected = directoryEntry.path === selectedDirectory;

  return (
    // ui:folder name
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
            userOnSelect={userOnSelect}
            toggleClosed={() => {
              setOpen(!open);
            }} />
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

// recursive (for now) directory tree representation
// File component, Directory component, various Icon components
function FileBrowser({ files, userOnSelect, onFileSelect, onFileRename, onDirectorySelect, selectedFile, selectedDirectory }) {
  console.log('files: ', files);

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
