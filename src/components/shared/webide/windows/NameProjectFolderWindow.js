import React from 'react';
import { Card, CardTitle } from 'reactstrap';
import NameInput from './NameInput';


export default function NameProjectFolderWindow({ active, onConfirm, onCancel }) {

  return !active ? null : (
    <Card className="name-project-folder-window">
      <CardTitle className="name-project-folder-window-title">Name Your Project</CardTitle> 
      <NameInput
        placeholder="Your new project name"
        onEnter={ onConfirm }
        onConfirm={ onConfirm }
        onCancel={ onCancel } />
    </Card>
  );

}
