import { Card, CardTitle, CardBody } from 'reactstrap';

export function DeleteFolderWindow({ active, selectedFolder, onConfirm, onCancel }) {

  if (!active) {
    return null;
  }

  const project = selectedFolder.project;
  const pathSegmentsFromRoot = selectedFolder.path.split('/');
  const isProjectFolder = pathSegmentsFromRoot.length === 2;
  const projectSubdir = isProjectFolder ? null : pathSegmentsFromRoot.slice(-1)[0];

  return (
    <Card className="delete-folder-window">
      <CardBody className="delete-folder-window-container">
        <CardTitle className="delete-folder-window-title">Confirmation</CardTitle>
        <div className="delete-folder-window-controls">
            {
              isProjectFolder ?
                <p>Are you sure you want to delete project <span className="folder-to-delete-parent-project">{ project }</span> ?</p> :
                <p>Are you sure you want to delete the folder
                  <span className="folder-to-delete"> {projectSubdir} </span> from project <span className="folder-to-delete-parent-project">{ project }</span> ?
                </p> 
            }
            <button onClick={ onConfirm }>Confirm</button>
            <button onClick={ onCancel }>Cancel</button>
        </div>
      </CardBody>
    </Card>
  );

}
