import React from 'react';

export default ({ message, options, close }) => (
  <div className={`alert ${options.type}`} onClick={close}>
    <div className="text-white icon">
      {options.type === 'info' && <i className="fa fa-2x fa-info-circle" />}
      {options.type === 'success' && <i className="fa fa-2x fa-check-circle" />}
      {options.type === 'error' && <i className="fa fa-2x fa-exclamation-circle" />}
    </div>
    <div className="text-white message">
      {message}
    </div>
  </div>
);
