/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import cn from 'classnames';

export function RevertFileButton({ disabled, onRevertFile }) {
  return (
    <button
      type="button"
      disabled={ disabled }
      title="revert file to previously saved state"
      className={
        cn('revert-file fas fa-history', { disabled })
      }
      onClick={ onRevertFile } />

  )
}

export function SaveButton({ disabled, onSave }) {

  const [ loading, setLoading ] = useState(false);
  return (
    <button
      type="button"
      disabled={ disabled }
      title="save file to instance"
      className={ cn("save-code fas", {
        disabled, 
        'fa-save': !loading,
        'fa-spinner': loading,
        'fa-spin': loading
      }) }
      onClick={ 
        async () => {

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
    <button type="button" className="restart-instance">
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
      type="button"
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

export default function EditorMenu({ SaveButton: SaveBtn, RestartInstanceButton: RestartInstanceBtn, RestartOnSaveToggle: RestartOnSaveTgl, RevertFileButton: RevertFileBtn }) {
  return (
    <ul className="editor-menu">
      <li>
        <SaveBtn />
      </li>
      <li>
        <RestartInstanceBtn />
      </li>
      <li>
        <RestartOnSaveTgl />
      </li>
      <li>
        <RevertFileBtn />
      </li>
    </ul>
  )
}
