import { Card, CardTitle, CardBody } from 'reactstrap';

export function DeleteFileWindow({ active, selectedFile, onConfirm, onCancel }) {

  if (!active) {
    return null;
  }

  const project = selectedFile.project;
  const filepath = selectedFile.path.split(`/${project}/`)[1];

  return (
    <Card className="delete-file-window">
      <CardBody className="delete-file-window-container">
        <CardTitle className="delete-file-window-title">Delete Confirmation</CardTitle>
        <div className="delete-file-window-controls">
            <p>Are you sure you want to delete file <span className="file-to-delete">{filepath}</span> from project <span className="file-to-delete-parent-project">{ project }</span> ?</p> 
            <button onClick={ onConfirm }>Delete</button>
            <button onClick={ onCancel }>Cancel</button>
        </div>
      </CardBody>
    </Card>
  );

}
