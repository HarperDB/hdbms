import React from 'react';

export default ({ message }) => (
  <div className="loader">
    <div className="mb-3">{message}</div>
    <i className="fa fa-spin fa-spinner text-white" />
  </div>
);
