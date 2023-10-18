import { Card, CardTitle, CardBody } from 'reactstrap';

export function DeletePackageWindow({ active, selectedPackage, onConfirm, onCancel }) {

  if (!active) {
    return null;
  }

  const packageName = selectedPackage.name;

  return (
    <Card className="delete-package-window">
      <CardBody className="delete-package-window-container">
        <div className="delete-package-window-controls">
          <CardTitle className="delete-package-window-title">Delete Confirmation</CardTitle>
          <p>Are you sure you want to delete package <span className="package-to-delete">{ packageName }</span> ?</p>
          <button className="btn btn-secondary btn-danger" onClick={ onConfirm }>Delete</button>
          <button className="btn btn-secondary" onClick={ onCancel }>Cancel</button>
        </div>
      </CardBody>
    </Card>
  );

}
