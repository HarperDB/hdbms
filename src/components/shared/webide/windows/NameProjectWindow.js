import React from 'react';
import { Card, CardText, CardTitle, CardBody } from 'reactstrap';
import NameInput from './NameInput';

export function NameProjectWindow({ active, onConfirm, onCancel }) {
  return !active ? null : (
    <Card className="name-project-window">
      <CardTitle className="name-project-window-title">Name Your Project</CardTitle> 
      <NameInput
        placeholder="Your new project name"
        onEnter={ onConfirm }
        onConfirm={ onConfirm }
        onCancel={ onCancel } />
    </Card>
  );
}
