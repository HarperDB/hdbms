import React from 'react';
import { Card, CardTitle, CardBody } from 'reactstrap';
import ButtonWithLoader from '../../ButtonWithLoader'; 

export default function DeletePackageWindow({ active, selectedPackage, onConfirm, onCancel }) {

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
          <ButtonWithLoader
            className="btn btn-danger delete-button"
            onClick={ onConfirm }>
            Delete
          </ButtonWithLoader>
          <button type="button" className="btn btn-secondary cancel-button" onClick={ onCancel }>Cancel</button>
        </div>
      </CardBody>
    </Card>
  );

}
