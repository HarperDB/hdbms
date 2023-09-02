import React, { useEffect, useState } from 'react';
import { Input } from 'reactstrap';
import { Link } from 'react-router';
import cn from 'classnames';
import setComponentFile from '../../../functions/api/instance/setComponentFile.js'

function NoProjects() {
  return (
    <div className="no-projects">
      <p>You have no HarperDB applications yet. Click the <i className="fas fa-folder-plus" /> button in the menu above to create your first application!</p>
      <p>See the <a href="https://docs.harperdb.io" target="_blank"> documentation </a> for more info on HarperDB Applications.
      </p>
    </div>
  );
}

function directorySortComparator(a, b) {

  // directories first, then flat files sorted
  // ascending, alphanumerically
  const A = +Boolean(a.entries);
  const B = +Boolean(b.entries);

  return A === B ? a.name.localeCompare(b.name) : B - A;

}

const isFolder = (entry) => Boolean(entry.entries);

function FolderIcon({ isOpen, toggleClosed }) {
  const folderClassName = isOpen ? 'fa-folder-open' : 'fa-folder';
  return <i onClick={toggleClosed} className={cn(`folder-icon fas ${folderClassName}`)} />;
}

function FiletypeIcon() {
  return <i className={ cn('file-icon fab fa-js') } />;
}

function PackageIcon() {
  return <i className={ cn('package-icon fas fa-link') } />;
}

function File({ directoryEntry, selectedFile, selectedFolder, onFileSelect, onFileRename, onFolderSelect, userOnSelect, toggleClosed, Icon }) {

  const [ editing, setEditing ] = useState(false);
  const [ newFileName, setNewFileName ] = useState(directoryEntry.name);
  const isDir = isFolder(directoryEntry);
  const isLink = Boolean(directoryEntry.package);
  const renameFileIconClass = 'rename-file';
  const isFileSelected = directoryEntry.path === selectedFile;
  const isFolderSelected = directoryEntry.path === selectedFolder?.path;


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

  function handleToggleSelected(e) {

      // set the folder/file as currently selected folder/file
      // visually highlight directory name
      // note: if directory already highlighted, make sure if we've clicked on the pencil/edit icon
      // that we don't untoggle directory selection; leave selected if icon clicked. 
      const iconWasClicked = e.target.classList.contains(renameFileIconClass); 

      if (isDir) {
        // one click on dir name toggles selected / highlighted state / ui
        const alreadySelected = directoryEntry?.path === selectedFolder?.path;
        if (alreadySelected && iconWasClicked) {
          return;
        } else {
          onFolderSelect(alreadySelected ? null : directoryEntry);
        }
      } else {
        // one click on file name sets it to selected / highlighted
        // AND retrieves file content
        onFileSelect(directoryEntry);
      }

  }

  return editing ?
    <Input
      className="filename-input"
      onChange={ (e) => setNewFileName(e.target.value) }
      onBlur={handleOnBlur}
      value={newFileName} /> :
    <button
      onClick={handleToggleSelected}
      className={
        cn('file', {
          'file-selected': isFileSelected,
          'folder-selected': isFolderSelected
        })
      }
      onKeyDown={noOp} >
        <Icon className="filename-icon" />
        <span
          className="filename-text">{directoryEntry.name}
        </span>
        <i onClick={onFileRename} className={`${renameFileIconClass} fas fa-pencil-alt`} />
    </button>

}

function Folder({ directoryEntry, userOnSelect, onFolderSelect, onFileSelect, onFileRename, selectedFile, selectedFolder }) {

  const [ open, setOpen ] = useState(true);

  const entries = [...(directoryEntry.entries || [])].sort(directorySortComparator);

  // FolderIcon is a func so we can give it open args now, but instantiate it later.
  const Icon = directoryEntry.entries ?
     () => FolderIcon({ isOpen: open,  toggleClosed: () => setOpen(!open) })
       : directoryEntry.package
       ? PackageIcon : FiletypeIcon;

  const isSelected = directoryEntry.path === selectedFolder?.path;

  return (
    <>
      {
        // FIXME: don't hardcode 'components', get from root .name property of fileTree.
        directoryEntry.name !== 'components' ?
          <li key={directoryEntry.key} className={cn('folder-container')}>
            <File
              Icon={Icon}
              selectedFile={selectedFile}
              selectedFolder={selectedFolder}
              directoryEntry={directoryEntry}
              onFileRename={
                () => {
                  onFileRename(directoryEntry)
                }
              }
              onFileSelect={onFileSelect}
              onFolderSelect={onFolderSelect}
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
              <Folder
                selectedFile={selectedFile}
                selectedFolder={selectedFolder}
                directoryEntry={entry}
                onFileSelect={onFileSelect}
                onFileRename={onFileRename}
                onFolderSelect={onFolderSelect}
                userOnSelect={userOnSelect} />
            </ul>
          </li>
        ))
      }
    </>

  )

}

// A recursive directory tree representation
function FileBrowser({ files, userOnSelect, onFileSelect, onFileRename, onFolderSelect, selectedFile, selectedFolder }) {
  return files?.entries?.length ? 
    <ul className="file-browser">
      <Folder
        selectedFile={selectedFile}
        selectedFolder={selectedFolder}
        onFileSelect={onFileSelect}
        onFileRename={onFileRename}
        onFolderSelect={onFolderSelect}
        userOnSelect={userOnSelect}
        directoryEntry={files} />
    </ul> :
    <NoProjects /> 

}

export default FileBrowser
