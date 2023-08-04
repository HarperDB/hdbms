import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

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

function FolderIcon({ isOpen }) {
  const folderClassName = isOpen ? 'fa-folder-open' : 'fa-folder';
  return <i className={`folder-icon fas ${folderClassName}`} />;
}

function FiletypeIcon() {
  return <i className='fab fa-js' />;
}

function File({ directoryEntry, onSelect, toggleClosed, Icon }) {

  // file receives open/close toggle func from
  // parent. if it's a dir, calls toggle func on click
  // if it's a flat file, calls onSelect so 
  // parent can get file content.

  function emitFileInfoOrToggle() {

    const isDirectory = Boolean(directoryEntry.entries);

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

  const entries = [...(directoryEntry.entries || [])].sort(directorySortComparator);

  return (
    // ui:folder name
    <ul key={directoryEntry.key} className="folder-container">
      <File
        Icon={
          /*
           * note: FolderIcon is a func so we can give it
           * open args now, but instantiate it later.
           */
          directoryEntry.entries ? 
            () => FolderIcon({ isOpen: open })
          : FiletypeIcon
        }
        directoryEntry={directoryEntry}
        onSelect={onSelect}
        toggleClosed={() => { 
          setOpen(!open);
        }}
        />

      {
        // ui:folder contents
        entries.map((entry) => (
          <ul key={entry.key} className={`folder folder-contents-${open ? 'open' : 'closed' }`}>
            <Directory
              directoryEntry={entry}
              onSelect={onSelect} />
          </ul>

        ))
      }

    </ul>
  )

}

// recursive (for now) directory tree representation
// File component, Directory component, various Icon components
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
