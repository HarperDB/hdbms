import React, { useEffect, useState } from 'react';
import cn from 'classnames';

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
  return <i className={cn(`folder-icon fas ${folderClassName}`)} />;
}

function FiletypeIcon() {
  return <i className={ cn('file-icon fab fa-js') } />;
}

function File({ directoryEntry, selectedFile, onSelect, toggleClosed, Icon }) {

  // file receives open/close toggle func from
  // parent. if it's a dir, calls toggle func on click
  // if it's a flat file, calls onSelect so 
  // parent can get file content.
  //
  const isDirectory = entry => Boolean(entry.entries);

  function noOp() {
    // TODO: figure out how to handle keyboard events properly.
    // for now, use this to avoid react a11y errors.
  }

  function handleFileSelection() {

    if (isDirectory(directoryEntry)) {
      toggleClosed();
    } else {
      onSelect(directoryEntry);
    }

  }

  const isSelected = !isDirectory(directoryEntry) && directoryEntry.path === selectedFile;

  return (
    <button
      className={ cn("file", { selected: isSelected }) }
      onClick={ handleFileSelection }
      onKeyDown={ noOp } >
        <Icon className="filename-icon" />
        <span className="filename-text">{ directoryEntry.name }</span>
    </button>
  )

}

function Directory({ directoryEntry, onSelect, selectedFile }) {

  const [ open, setOpen ] = useState(true);

  const entries = [...(directoryEntry.entries || [])].sort(directorySortComparator);

  return (
    // ui:folder name
    <ul key={directoryEntry.key} className="folder-container">
      <li role="menuitem">
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
          selectedFile={selectedFile}
          directoryEntry={directoryEntry}
          onSelect={onSelect}
          toggleClosed={() => { 
            setOpen(!open);
          }}
          />
    </li>

    {
      // ui:folder contents
      entries.map((entry) => (
        <ul key={entry.key} className={`folder folder-contents-${open ? 'open' : 'closed' }`}>
          <li role="menuitem">
            <Directory
              selectedFile={selectedFile}
              directoryEntry={entry}
              onSelect={onSelect} />
          </li>
        </ul>

      ))
    }

    </ul>
  )

}

// recursive (for now) directory tree representation
// File component, Directory component, various Icon components
function FileBrowser({ files, onSelect, selectedFile }) {

  if (!files) return null;

  return (
    <ul className="file-browser">
    <Directory
      selectedFile={selectedFile}
      onSelect={onSelect}
      directoryEntry={files} />
    </ul>
  )


}


export default FileBrowser
