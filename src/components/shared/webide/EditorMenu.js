/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import cn from 'classnames';

export function SaveButton({ onClick, disabled }) {

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
          await onClick();
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

export function RestartOnSaveToggle({ onClick, restartAfterSave }) {

  const title = restartAfterSave ?
    'restart instance after saving application files' :
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

export function RevertFileButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={ disabled }
      title="revert file to previously saved state"
      className={
        cn('revert-file fas fa-history', { disabled })
      }
      onClick={ onClick } />

  )
}

// TODO: convert to mapping children to a list instead of explicitly doing all of this
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
