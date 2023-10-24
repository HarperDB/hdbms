import React from 'react';
import { Card, CardTitle } from 'reactstrap';
import NameInput from './NameInput';

export default function NameFileWindow({ active, onConfirm, onCancel }) {
  return !active ? null : (
    <Card className="name-file-window">
        <CardTitle className="name-file-window-title">Name Your File</CardTitle>
        <NameInput
          placeholder="Your new file name"
          onEnter={ onConfirm }
          onConfirm={ onConfirm }
          onCancel={ onCancel } />
    </Card>
  );
}
