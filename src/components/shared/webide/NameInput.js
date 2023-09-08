import React, { useState } from 'react';
import cn from 'classnames';

export default function NameInput({ onCancel, onConfirm, onEnter, onBlur, label='', value }) {

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
      onBlur={ blurOnEsc }
      tabIndex={0}
      className={ cn("name-input") }>
      <label>
        <span>{label}:</span>
        <input
          autoFocus
          onChange={(e) => {
            setName(e.target.value)
          }}
          onKeyDown={ handleKeyDown }
          value={name}
          title="choose name for your new file or folder" />
        <button onClick={ onCancel }>cancel</button>
        <button onClick={ () => {
          onConfirm(name); 
        }}>ok</button>
      </label>
    </div>
  );

}



