import React from 'react';

import Loader from './loader';
import config from '../../config';

export default () => (
  <>
    <div id="login-logo" title="HarperDB Logo" />
    <div className="version">Studio v{config.studio_version}</div>
    <Loader header="HarperDB Studio Is Being Updated" body="Please check back in a few minutes and get ready for a whole new batch of awesome!" />
  </>
);
