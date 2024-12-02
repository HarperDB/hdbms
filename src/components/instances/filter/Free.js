import React, { useState, useCallback } from 'react';
import { Button } from 'reactstrap';

function Free({ local }) {
  return (
    <div className="free-instances text-nowrap text-white">
      <i className="fa fa-dollar-sign me-2" />
      Free {true && <span className="ms-1">Enterprise</span>}
    </div>
  );
}

export default Free;
