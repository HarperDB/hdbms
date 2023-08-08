import React, { useEffect, useState } from 'react';
import cn from 'classnames';

export function SaveButton({ disabled, onSave, saveButton }) {
  const title = disabled ? "Cannot save due to validation errors" : "Save File to Instance";  
  return (
    <button
      disabled={ disabled }
      title={ title }
      className={ cn("save-code fas fa-save", { disabled }) }
      onClick={ onSave } />
  )
}

function EditorMenu({ onSave, SaveButton }) {
  return (
    <ul className="editor-menu">
      <li>
        <SaveButton onSave={onSave} />
      </li>
    </ul>
  )
}

export default EditorMenu;
