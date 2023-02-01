import React from 'react';

import Examples from '../../shared/examples';

export const metadata = {
  path: `examples/:folder?/:method?`,
  link: 'examples',
  label: 'example code',
  icon: 'code',
  iconCode: 'f121',
}
function InstanceExamples() {
  return <Examples />
}

export default InstanceExamples;
