import React from 'react';

export default function DefaultFolderWindow({ active }) {
  return !active ? null : (
    <div className="content-window text-nowrap">
      <i className="fa fa-exclamation-triangle mt-5 pt-5" />
      &nbsp;<span>You have selected a folder. Nothing to see here!</span>
    </div>
  );
}
