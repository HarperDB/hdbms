import React, { useEffect, useState } from 'react';
import cn from 'classnames';

function EditorMenu({ saveCode }) {
  return (
    <ul className="editor-menu">
      <li>
        <button
          title="save file"
          className="save-code fas fa-save"
          onClick={ saveCode } />
      </li>
    </ul>
  )
}

export default EditorMenu;
