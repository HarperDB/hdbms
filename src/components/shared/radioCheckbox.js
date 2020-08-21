import React, { useEffect, useState } from 'react';

export default ({ required, onChange, options, type, defaultValue, ...rest }) => {
  const optionsArray = !options.length ? [options] : options;
  const [value, setValue] = useState([]);

  const handleClick = (v) => {
    const isRadio = type === 'radio';
    let newValue = [...value];

    if (newValue.indexOf(v) !== -1 && isRadio && required) {
      // eslint-disable-next-line no-console
      console.log('not unsetting required radio');
    } else if (newValue.indexOf(v) === -1 && isRadio) {
      newValue = [v];
    } else if (newValue.indexOf(v) === -1) {
      newValue.push(v);
    } else {
      newValue.splice(newValue.indexOf(v), 1);
    }
    setValue(newValue);
    onChange(!options.length || isRadio ? newValue[0] : newValue);
  };

  useEffect(() => {
    if (defaultValue) {
      handleClick(defaultValue.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div {...rest}>
      {optionsArray &&
        optionsArray.map((option) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <div role="button" tabIndex="0" key={`${type}${option.value}${option.label}`} onClick={() => handleClick(option.value)}>
            <div className={`radio-checkbox ${value.indexOf(option.value) !== -1 ? 'show' : 'hidden'}`}>
              {type === 'checkbox' ? <span className="checkmark">&#10004;</span> : <div className="dot" />}
            </div>
            <div className="radio-checkbox-label">{option.label}</div>
          </div>
        ))}
    </div>
  );
};
