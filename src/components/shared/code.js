import React, { useEffect } from 'react';
import lolight from 'lolight';
import { useAlert } from 'react-alert';

export default ({ children, className, ...rest }) => {
  const alert = useAlert();

  useEffect(() => {
    if (children) {
      lolight();
    }
  }, [children]);

  const copyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert.success('Successfully copied code snippet');
      } else {
        alert.error('Unable to copy code snippet');
      }
    } catch (err) {
      alert.error('Unable to copy code snippet');
    }
    document.body.removeChild(textArea);

    if (rest.onClick) {
      rest.onClick();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <pre {...rest} className={`lolight ${className}`} onClick={() => copyToClipboard(children)}>
      {children}
    </pre>
  );
};
