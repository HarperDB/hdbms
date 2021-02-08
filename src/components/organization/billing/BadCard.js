import React from 'react';

const BadCard = () => (
  <div className="text-danger">
    <span className="fa fa-exclamation-circle mr-2" />
    <i>Your most recent card payment failed. Please update your card below.</i>
    <hr className="mt-3 mb-2" />
  </div>
);

export default BadCard;
