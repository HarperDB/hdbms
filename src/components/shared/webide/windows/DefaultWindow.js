import React from 'react';

export default function DefaultWindow({ active, fileTree, AddProjectButton, InstallPackageButton }) {
  return !active ? null : (
    <div className="content-window">
      <h4 className="mb-5">HarperDB Applications Editor</h4>
      <AddProjectButton />
      <InstallPackageButton />
      {fileTree?.entries.length > 0 && (
        <div className="mt-5">
          <i className="menu-pointer-icon fa fa-arrow-left" /> <span>Choose a file from the menu on the left</span>
        </div>
      )}
    </div>
  );
}
