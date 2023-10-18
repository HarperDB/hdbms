import React from 'react';
import { Card, CardText, CardTitle, CardBody } from 'reactstrap';
import NameInput from './NameInput';

export function NameProjectWindow({ active, onConfirm, onCancel }) {
  return !active ? null : (
    <Card className="name-project-window">
      <CardBody className="name-project-window-container">
        <CardTitle className="name-project-window-title">Name Your Project</CardTitle> 
        <div className="name-project-window-input">
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
