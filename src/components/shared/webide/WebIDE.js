import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import Editor from '@monaco-editor/react';
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';

import getComponentFile from '../../../functions/api/instance/getComponentFile';
import FileBrowser from './FileBrowser';
import EditorWindow from './EditorWindow';

/* 
 * input: file tree
 * hooks: change, save
 */

function WebIDE({ fileTree, onSave, onChange }) {

  const [ code, setCode ] = useState('');

  async function updateCurrentFile(file) {
    const response = await getComponentFile({
      auth: { user: 'alex', pass: 'alex' },
      url: 'http://localhost:9825',
      project: file.project,
      file: file.path,
    });
    setCode(response.message);
  }
  // onselect calls get component file, sets code to that, passes that to editor window
  return (
    <div className="web-ide">

      <div className="file-browser-container">
        <FileBrowser files={ fileTree } onSelect={ updateCurrentFile } />
      </div>

      <div className="code-editor-container">
        <EditorWindow code={ code } />
      </div>

    </div>
  );
}

export default WebIDE;
