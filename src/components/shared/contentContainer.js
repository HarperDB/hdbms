import React from 'react';

export default ({ children, header, maxHeight = false, className }) => (
  <div className={`content-container ${className}`}>
    <div className="header">{header}</div>
    <hr className="my-2" />
    {maxHeight ? (
      <div className="scrollable" style={{ maxHeight }}>
        {children}
      </div>
    ) : (
      children
    )}
  </div>
);
