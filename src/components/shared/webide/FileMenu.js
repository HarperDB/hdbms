import React from 'react';
import cn from 'classnames';

export function DeleteFolderButton({ onClick, disabled }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="delete-folder-icon fas fa-folder-minus" title="Delete selected project, folder or package" />;
}

export function AddProjectFolderButton({ onClick, disabled }) {
  return <button type="button" disabled={disabled} onClick={onClick} className="add-folder-icon fas fa-folder-plus" title="Add a new subdirectory to your project" />;
}

export function InstallPackageButton({ onClick, text = '', extraClasses = '' }) {
  return (
    <button type="button" onClick={onClick} className={cn(`install-package-icon ${extraClasses}`)} title="Install external package from url or NPM package spec">
      <i className="fas fa-share-alt" />
      {text && <span className="ms-3 install-package-button-text">{text}</span>}
    </button>
  );
}

export function AddProjectButton({ onClick, disabled = false, text = '', extraClasses = '' }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={cn(`add-package-icon ${extraClasses}`)} title="Add a new project">
      <i className="fas fa-file-code" />
      {text && <span className="ms-3 add-project-button-text"> {text}</span>}
    </button>
  );
}

export function AddFileButton({ onClick, disabled }) {
  return <button type="button" disabled={disabled} onClick={onClick} className="add-file-icon fas fa-plus" title="Add a new file" />;
}

export function DeleteFileButton({ onClick, disabled }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="delete-file-icon fas fa-minus" title="Delete selected file" />;
}

function FileMenu({ children }) {
  return (
    <ul className="file-menu">
      {children.map((child) => (
        <li className="file-menu-item" key={crypto.randomUUID()}>
          {child}
        </li>
      ))}
    </ul>
  );
}

export default FileMenu;
