import React, { useEffect, useState } from 'react';
import cn from 'classnames';

function FileMenu() {
  return (
    <ul className="file-menu">
      <li><button className="add-folder fas fa-folder-plus" title="add a new folder"/></li>
      <li><button className="add-file fas fa-plus" title="add a new file"/></li>
      <li><button className="upload-file fas fa-upload" title="upload a file"/></li>
    </ul>
  )
}

export default FileMenu;
