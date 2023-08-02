import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

function directorySortComparator(a, b) {

  // sort by whether it's a directory or a regular file
  // and if that's a tie, sort alphanumerically, ascending.
  const A = +Boolean(a.entries);
  const B = +Boolean(b.entries);

  return A === B ? a.name.localeCompare(b.name) : B - A;

}

function FolderIcon({ isOpen }) {
  const folderClassName = isOpen ? 'fa-folder-open' : 'fa-folder';
  return <i className={`fas ${folderClassName}`} />;
}

function FileIcon() {
  return <i className='fab fa-js' />;
}

function File({ directoryEntry, onSelect, toggleClosed, Icon }) {

  // file receives open/close toggle func from
  // parent. if it's a dir, calls toggle func on click
  // if it's a flat file, calls onSelect so 
  // parent can get file content.
  const isDirectory = Boolean(directoryEntry.entries);
  function emitFileInfoOrToggle() {
    if (isDirectory) {
      toggleClosed();
    } else {
      onSelect(directoryEntry);
    }
  }

  return (
    <button
      className="file"
      onClick={ emitFileInfoOrToggle }
      onKeyDown={ emitFileInfoOrToggle } >
          <Icon />
        <span> { directoryEntry.name }</span>
    </button>
  )

}

function Directory({ directoryEntry, onSelect }) {

  const [ open, setOpen ] = useState(true);

  return (
    // folder name
    <ul className="folder-container">
      <File
        Icon={
          /*
           * note: FolderIcon is a func so we can give it
           * open args now, but instantiate it later.
           */
          directoryEntry.entries ? 
            () => FolderIcon({ isOpen: open })
          : FileIcon
        }
        directoryEntry={directoryEntry}
        onSelect={onSelect}
        toggleClosed={() => { 
          setOpen(!open);
        }}
        />

      {
        // folder contents
        directoryEntry?.entries?.sort(directorySortComparator)?.map(entry => (

          <ul className={`folder folder-contents-${open ? 'open' : 'closed' }`}>
            <Directory
              directoryEntry={entry}
              onSelect={onSelect} />
          </ul>

        ))
      }

    </ul>
  )

}

function FileBrowser({ files, onSelect }) {

  if (!files) return null;

  return (
    <ul className="file-browser">
      <Directory
        onSelect={ onSelect }
        directoryEntry={files} />
    </ul>
  )

}


export default FileBrowser
