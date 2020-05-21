import React from 'react';

export default ({ children, header, subheader, maxHeight = false, className }) => (
  <div className={`content-container ${className}`}>
    <div className="header-container">
      <span className="header">{header}</span>
      <span className="subheader">{subheader}</span>
    </div>
    {maxHeight ? (
      <div className="scrollable" style={{ maxHeight }}>
        {children}
      </div>
    ) : (
      children
    )}
  </div>
);
