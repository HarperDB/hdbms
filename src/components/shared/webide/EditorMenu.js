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

export function RestartSetting({ disabled, onClick }) {

  const title = disabled ?
    'do not restart instance after files are saved' :
    'restart instance after files are saved';

  return (
    <div className="restart-instance-setting">
      <i
        onClick={ onClick }
        title={title}
        className={
          cn("restart-instance-setting-icon fas fa-sync", { disabled })
        } />
    </div>
  );
}

export default function EditorMenu({ SaveButton, RestartSetting }) {
  return (
    <ul className="editor-menu">
      <li>
        <SaveButton />
      </li>
      <li>
        <RestartSetting />
      </li>
    </ul>
  )
}
