import React from 'react';

export default ({ children, header, subheader, maxHeight = 'auto', minHeight = 'auto', className }) => (
  <div className={`content-container ${className}`}>
    <div className="header-container">
      <span className="header">{header}</span>
      <span className="subheader">{subheader}</span>
    </div>
    <div className="scrollable" style={{ maxHeight, minHeight }}>
      {children}
    </div>
  </div>
);
