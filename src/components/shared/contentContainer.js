import React from 'react';

export default ({ children, header, subheader, maxHeight = false, className }) => (
  <div className={`content-container ${className}`}>
    <div className="text-small">
      <span className="header">{header}</span>
      &nbsp;
      <span className="subheader">{subheader}</span>
    </div>
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
