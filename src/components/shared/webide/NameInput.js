import React, { useState } from 'react';
import cn from 'classnames';

export default function NameInput({ enabled, onCancel, onConfirm, onBlur, label='', value }) {

  const [ name, setName ] = useState(value || '');

  if (!enabled)
    return null;

  return (
    <div className={ cn("name-input", { disabled: !enabled }) }>
      <label>
        <span>{label}:</span>
        <input
          autoFocus
          onChange={(e) => setName(e.target.value) }
          value={name}
          title="choose name for your new file or folder" />
        <button onClick={ onCancel } >cancel</button>
        <button onClick={ () => onConfirm(name) }>ok</button>
      </label>
    </div>
  );

}



