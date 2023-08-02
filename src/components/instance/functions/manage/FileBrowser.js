import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

function Icon({ isDirectory=false }) {
  return isDirectory ? <i className="fas fa-folder-open" /> : null;
}

function File({ directoryEntry, onSelect, toggleOpen }) {
  
  const isDirectory = Boolean(directoryEntry.entries);

  return (
    <button
      className="file"
      onClick={() => {
        onSelect(directoryEntry)
        toggleOpen();
      }}
      onKeyDown={() => onSelect(directoryEntry) } >
        <Icon isDirectory={isDirectory }/>
        <span> { directoryEntry.name }</span>
    </button>
  )

}

function directorySortComparator(a, b) {

  // sort by whether it's a directory or a regular file
  // and if that's a tie, sort alphanumerically, ascending.
  const A = +Boolean(a.entries);
  const B = +Boolean(b.entries);

  return A === B ? a.name.localeCompare(b.name) : B - A;

}

function Directory({ directoryEntry, open, onSelect }) {

  const [ isOpen, setIsOpen ] = useState(open);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  }

  return (
    <ul className="folder-contents">
      <File
        directoryEntry={directoryEntry}
        onSelect={onSelect}
        toggleOpen={toggleOpen} />

      {
        // sort children by 1. dirs first, 2. alpha 
        directoryEntry?.entries?.sort(directorySortComparator)?.map(entry => (

          <ul className={`folder folder-${isOpen ? 'open' : 'closed'}`}>
            <Directory
              open
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
        open
        onSelect={ onSelect }
        directoryEntry={files} />
    </ul>
  )

}


export default FileBrowser
