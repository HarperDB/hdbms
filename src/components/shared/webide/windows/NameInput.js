/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React, { useState } from 'react';
import cn from 'classnames';

export default function NameInput({ onCancel, onConfirm, onEnter, label='', placeholder='',  value }) {

  const [ name, setName ] = useState(value || '');

  function handleKeyDown(e) {

    if (e.key === 'Enter') {
      onEnter(e.target.value);
    } else if (e.key === 'Esc') {
      onCancel()
    }

  }

  /*
   * TODO: do we need this? if not, remove.
  function blurOnEsc(e) {
    // related target is button when 'ok' is clicked,
    // null if esc.
    if (!e.relatedTarget) {
      onCancel();
    }
  }
  */

  return (
    <div
      tabIndex={0}
      className={ cn("name-input") }>
      { label && <label><span>{label}:</span></label> }
        <input
          autoFocus
          onChange={(e) => {
            setName(e.target.value)
          }}
          onKeyDown={ handleKeyDown }
          value={name}
          placeholder={placeholder}
          title="choose name for your new file or folder" />

          <div className="name-input-buttons-container">
            <button type="button" className="btn btn-success name-input-confirm" onClick={ () => {
                onConfirm(name); 
              }}>ok</button>
            <button type="button" className="btn btn-secondary name-input-cancel cancel-button" onClick={ onCancel }>cancel</button>
        </div>
    </div>
  );

}
