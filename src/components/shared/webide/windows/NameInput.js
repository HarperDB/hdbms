import React, { useState } from 'react';
import cn from 'classnames';

export default function NameInput({ onCancel, onConfirm, onEnter, onBlur, label='', placeholder='',  value }) {

  const [ name, setName ] = useState(value || '');

  function handleKeyDown(e) {

    if (e.key === 'Enter') {
      onEnter(e.target.value);
    } else if (e.key === 'Esc') {
      onCancel()
    }

  }

  function blurOnEsc(e) {
    // related target is button when 'ok' is clicked,
    // null if esc.
    if (!e.relatedTarget) {
      onCancel();
    }
  }

  return (
    <div
      onBlur={ () => {}  /* blurOnEsc */ }
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
            <button className="btn btn-success name-input-confirm" onClick={ () => {
                onConfirm(name); 
              }}>ok</button>
            <button className="btn btn-secondary name-input-cancel cancel-button" onClick={ onCancel }>cancel</button>
        </div>
    </div>
  );

}
