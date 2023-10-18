import { Card, CardTitle, CardBody } from 'reactstrap';
import NameInput from './NameInput';

export function NameFileWindow({ active, onConfirm, onCancel }) {
  return !active ? null : (
    <Card className="name-file-window">
      <CardBody className="name-file-window-container">
        <CardTitle className="name-file-window-title">Name Your File</CardTitle>
        <div className="name-file-window-input">
          <NameInput
            placeholder="Your new file name"
            onEnter={ onConfirm }
            onConfirm={ onConfirm }
            onCancel={ onCancel } />
        </div>
      </CardBody>
    </Card>
  );
}
