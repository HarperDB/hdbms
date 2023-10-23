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
        <div className="delete-file-window-controls">
          <CardTitle className="delete-file-window-title">Delete Confirmation</CardTitle>
          <p>Are you sure you want to delete file <span className="file-to-delete">{filepath}</span> from project <span className="file-to-delete-parent-project">{ project }</span> ?</p> 
          <button className="btn btn-danger delete-button" onClick={ onConfirm }>Delete</button>
          <button className="btn btn-secondary cancel-button" onClick={ onCancel }>Cancel</button>
        </div>
      </CardBody>
    </Card>
  );

}
