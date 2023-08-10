import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

import cn from 'classnames';

function ExternalLink({ href, target, children }) {

  return (
    <a
      href={href}
      target={target}
      onClick={ window.location.href = href }>
      { children }
    </a>
  );

}

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

function File({ directoryEntry, selectedFile, selectedDirectory, onFileSelect, onDirectorySelect, userOnSelect, toggleClosed, Icon }) {

  // file receives open/close toggle func from
  // parent. if it's a dir, calls toggle func on click
  // if it's a flat file, calls onFileSelect so
  // parent can get file content.
  //

  function noOp() {
    // TODO: figure out how to handle keyboard events properly.
    // for now, use this to avoid react a11y errors.
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
    <button
      className={cn("file", {
        'file-selected': isFileSelected,
        'folder-selected': isFolderSelected
      })}
      onClick={ handleFileSelection }
      onKeyDown={ noOp } >
        <Icon className="filename-icon" />
        <span className="filename-text">{ directoryEntry.name }</span>
    </button>
  )

}

function Directory({ directoryEntry, userOnSelect, onDirectorySelect, onFileSelect, selectedFile, selectedDirectory }) {

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
function FileBrowser({ files, userOnSelect, onFileSelect, onDirectorySelect, selectedFile, selectedDirectory }) {
  console.log('files: ', files);

  if (!files) return null;

  return files.entries.length ? (
    <ul className="file-browser">
      <Directory
        selectedFile={selectedFile}
        selectedDirectory={selectedDirectory}
        onFileSelect={onFileSelect}
        onDirectorySelect={onDirectorySelect}
        userOnSelect={userOnSelect}
        directoryEntry={files} />
    </ul>
  ) : <NoProjects /> 


}


export default FileBrowser
