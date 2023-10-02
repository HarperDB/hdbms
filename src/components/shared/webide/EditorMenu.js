import React, { useEffect, useState } from 'react';
import cn from 'classnames';

export function SaveButton({ disabled, onSave, saveButton }) {

  const [ loading, setLoading ] = useState(false);
  return (
    <button
      disabled={ disabled }
      title="save file to instance"
      className={ cn("save-code fas", {
        disabled, 
        'fa-save': !loading,
        'fa-spinner': loading,
        'fa-spin': loading
      }) }
      onClick={ 
        async (e) => {

          setLoading(true);
          await onSave();
          setTimeout(() => {
            setLoading(false);
          }, 500);
        }
      } />
  )

}

function EditorMenu({ SaveButton }) {
  return (
    <ul className="editor-menu">
      <li>
        <SaveButton />
      </li>
    </ul>
  )
}

export default EditorMenu;
