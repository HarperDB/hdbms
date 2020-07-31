import React, { useEffect } from 'react';
import lolight from 'lolight';

export default ({ children, className, ...rest }) => {
  useEffect(() => {
    if (children) {
      lolight();
    }
  }, [children]);

  return (
    <pre {...rest} className={`lolight ${className}`}>
      {children}
    </pre>
  );
};
