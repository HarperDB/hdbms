import React from 'react';
import { Button } from '@nio/ui-kit';

export default () => (
  <div id="app-container">
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      <div className="text-white text-center">
        HarperDB Studio is Coming Soon!
        <Button onClick={() => (window.location.href = 'https://harperdb.io/pricing/harperdb-cloud/')} block color="success" className="mt-4">
          Learn More
        </Button>
      </div>
    </div>
  </div>
);
