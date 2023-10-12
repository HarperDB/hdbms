import React from 'react';
import { Card, CardText, CardTitle } from 'reactstrap';
import NameInput from './NameInput';

export function NameProjectWindow({ active, onConfirm, onCancel }) {
  return !active ? null : (
    <Card>
      <CardTitle>Name Your Project</CardTitle> 
      <div>
        <NameInput
          label="New Project Name"
          onEnter={ onConfirm }
          onConfirm={ onConfirm }
          onCancel={ onCancel } />
      </div>
    </Card>
  );
}
