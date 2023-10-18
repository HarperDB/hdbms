import React from 'react';
import { Card, CardText, CardTitle, CardBody } from 'reactstrap';
import NameInput from './NameInput';


export function NameProjectFolderWindow({ active, onConfirm, onCancel, projectName }) {

  return !active ? null : (
    <Card className="name-project-folder-window">
      <CardBody className="name-project-folder-window-container">
        <CardTitle className="name-project-folder-window-title">Name Your Project</CardTitle> 
        <div className="name-project-folder-window-input">
          <NameInput
            placeholder="Your new project name"
            onEnter={ onConfirm }
            onConfirm={ onConfirm }
            onCancel={ onCancel } />
        </div>
      </CardBody>
    </Card>
  );

}
