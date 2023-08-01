import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

function Icon({ isDirectory=false }) {
  return isDirectory ? <icon className="fas fa-folder-open" /> : null;
}

function File({ directoryEntry }) {
  
  const isDirectory = directoryEntry.entries;

  return <li className="file">
    <Icon isDirectory={isDirectory }/>
    <span> { directoryEntry.name }</span>
  </li>
}

function FileTree({ directoryEntry, isOpen }) {
  console.log('directoryEntry: ', directoryEntry);

  return (
    <ul>
      <File directoryEntry={directoryEntry} />
      {
        directoryEntry?.entries?.map(entry => (
          <ul className="folder folder-open">
            <FileTree directoryEntry={entry} />
          </ul>
        ))
      }
    </ul>
  )

}

function FileBrowser({ files }) {

  if (!files) return null;

  return (
    <ul className="file-browser">
      <FileTree directoryEntry={files} />
    </ul>
  )

}


export default FileBrowser
