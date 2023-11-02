/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React, { useState } from 'react';
import cn from 'classnames';
import ButtonWithLoader from '../../ButtonWithLoader';

export default function NameInput({ onCancel, onConfirm, onEnter, label='', placeholder='', value, validate=() => true }) {

  const [ name, setName ] = useState(value || '');
  const [ isValidName, setIsValidName ] = useState(false); 

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
        <div className="name-input-container">
          <input
            className={ cn({ invalid: name.length > 0 && !isValidName }) }
            autoFocus
            onChange={(e) => {
              setName(e.target.value);
              setIsValidName(validate(e.target.value));
            }}
            onKeyDown={ handleKeyDown }
            value={name}
            placeholder={placeholder}
            title="choose name for your new file or folder" />
            <i title="error: project name must contain only alphanumeric characters, dashes and underscores." className={
              cn("invalid-project-name fa fa-warning", {
                hidden: isValidName || name.length === 0 
              })
            }
            />
        </div>
        { name.length > 0 && !isValidName && <span className="validation-message">error: project name must contain only alphanumeric characters, dashes and underscores.</span> }

          <span className="invalid-text" />
          <div className="name-input-buttons-container">

            <ButtonWithLoader
              disabled={ !isValidName }
              className="btn btn-success name-input-confirm"
              onClick={
                async () => {
                  await onConfirm(name); 
                }
              }>OK</ButtonWithLoader>
            <button
              type="button"
              className="btn btn-secondary name-input-cancel cancel-button"
              onClick={ onCancel }>
              Cancel
            </button>
        </div>
    </div>
  );

}
