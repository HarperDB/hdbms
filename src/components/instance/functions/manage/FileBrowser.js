import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

function File({name}) {
  return <li className="file">{name}</li>
}

function FileTree({ directoryEntry }) {
  console.log('directoryEntry: ', directoryEntry);

  return (
    <>
      <File name={directoryEntry.name} />
      {
        directoryEntry?.entries?.map(entry => (
          <ul>
            <FileTree directoryEntry={entry} />
          </ul>
        ))
      }
    </>
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
