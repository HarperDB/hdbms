import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

function Icon({ isDirectory=false }) {
  return isDirectory ? <i className="fas fa-folder-open" /> : null;
}

function File({ directoryEntry, onSelect, toggleOpen }) {
  
  const isDirectory = Boolean(directoryEntry.entries);

  return (<button
    className="file"
    onClick={() => {
      onSelect(directoryEntry)
      toggleOpen();
    }}
    onKeyDown={() => onSelect(directoryEntry) } >
      <Icon isDirectory={isDirectory }/>
      <span> { directoryEntry.name }</span>
  </button>)

}

function FileTree({ directoryEntry, open, onSelect }) {

  const [ isOpen, setIsOpen ] = useState(open);
  const visibility = isOpen ? 'closed' : 'open';
  const toggleOpen = () => {
    console.log(directoryEntry, visibility);
    setIsOpen(!isOpen);
  }

  return (
    <ul className="file-tree">
      <File directoryEntry={directoryEntry} onSelect={onSelect} toggleOpen={toggleOpen} />
      {
        directoryEntry?.entries?.map(entry => (
          <ul className={`folder folder-${visibility}`}>
            <FileTree open directoryEntry={entry} onSelect={onSelect} />
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
      <FileTree open onSelect={ onSelect } directoryEntry={files} />
    </ul>
  )

}


export default FileBrowser
