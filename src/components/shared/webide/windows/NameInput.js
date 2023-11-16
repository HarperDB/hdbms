/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React, { useState } from 'react';
import cn from 'classnames';
import ButtonWithLoader from '../../ButtonWithLoader';

export default function NameInput({ onCancel, onConfirm, onEnter, value, type, validate = () => true }) {
  const [name, setName] = useState(value || '');
  const [isValidName, setIsValidName] = useState(false);

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      onEnter(e.target.value);
    } else if (e.key === 'Esc') {
      onCancel();
    }
  }

  return (
    <>
      <input
        className={cn('w-100 text-center mb-3', { invalid: name.length > 0 && !isValidName })}
        autoFocus
        onChange={(e) => {
          setName(e.target.value);
          setIsValidName(validate(e.target.value));
        }}
        onKeyDown={handleKeyDown}
        value={name}
        placeholder={`name for your new ${type}`}
        title={`name for your new ${type}`}
      />
      <i
        title="error: name must contain only alphanumeric characters, dashes and underscores."
        className={cn('text-danger fa fa-warning', { hidden: isValidName || name.length === 0 })}
      />
      <ButtonWithLoader disabled={!isValidName} className="btn btn-success btn-block mt-2" onClick={() => onConfirm(name)}>
        OK
      </ButtonWithLoader>
      <button type="button" className="btn btn-outline-success btn-block mt-2" onClick={onCancel}>
        Cancel
      </button>

      {name.length > 0 && !isValidName ? (
        <div className="validation-message mt-5">error: name must contain only alphanumeric characters, dashes and underscores.</div>
      ) : (
        <div className="mt-5">Please enter the {type} name and click OK.</div>
      )}
    </>
  );
}
