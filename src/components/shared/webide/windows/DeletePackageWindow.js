import { Card, CardTitle, CardBody } from 'reactstrap';

export function DeletePackageWindow({ active, selectedPackage, onConfirm, onCancel }) {

  if (!active) {
    return null;
  }

  const packageName = selectedPackage.name;

  return (
    <Card className="delete-package-window">
      <CardBody className="delete-package-window-container">
        <CardTitle className="delete-package-window-title">Confirmation</CardTitle>
        <div className="delete-package-window-controls">
          <p>Are you sure you want to delete package <span className="package-to-delete">{ packageName }</span> ?</p>
          <button onClick={ onConfirm }>Delete</button>
          <button onClick={ onCancel }>Cancel</button>
        </div>
      </CardBody>
    </Card>
  );

}
