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

export function RestartInstanceButton({ onClick, restarting }) {

  return (
    <button className="restart-instance">
      <i
        onClick={ onClick }
        title='click to restart your instance'
        className={
          cn('restart-instance-icon fas', {
            "fa-sync": !restarting,
            "fa-spinner": restarting,
            "fa-spin": restarting
          })
        }
        />
    </button>
  );
}

export function RestartOnSaveToggle({ restartAfterSave, onClick }) {

  const title = restartAfterSave ?
    'your instance will restart after saving application files' :
    'your instance will not restart after saving application files';

  return (
    <button
      className="restart-instance-after-save"
      title={title}
      onClick={ onClick }>
      <i
        title={title}
        className={
        cn("fa", {
          "fa-toggle-on": restartAfterSave, 
          "fa-toggle-off": !restartAfterSave
        })
        } /> 
    </button>
  );
}

export default function EditorMenu({ SaveButton, RestartInstanceButton, RestartOnSaveToggle }) {
  return (
    <ul className="editor-menu">
      <li>
        <SaveButton />
      </li>
      <li>
        <RestartInstanceButton />
      </li>
      <li>
        <RestartOnSaveToggle />
      </li>
    </ul>
  )
}
