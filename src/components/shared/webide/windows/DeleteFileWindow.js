import React, { useState } from 'react';
import cn from 'classnames';
import { Card, CardTitle, CardBody } from 'reactstrap';
import { useAlert } from 'react-alert';
import ButtonWithLoader from '../../ButtonWithLoader'; 

export default function DeleteFileWindow({ active, selectedFile, onConfirm, onCancel }) {

  const [ loading, setLoading ] = useState(false);

  if (!active) {
    return null;
  }

  const {project} = selectedFile;
  const filepath = selectedFile.path.split(`/${project}/`)[1];


  return (
    <Card className="delete-file-window">
      <CardBody className="delete-file-window-container">
        <div className="delete-file-window-controls">
          <CardTitle className="delete-file-window-title">Delete Confirmation</CardTitle>
          <p>Are you sure you want to delete file <span className="file-to-delete">{filepath}</span> from project <span className="file-to-delete-parent-project">{ project }</span> ?</p> 
          <ButtonWithLoader
            className="btn btn-danger delete-button"
            onClick={ onConfirm }>
            Delete
          </ButtonWithLoader>
          <button
            type="button"
            className="btn btn-secondary cancel-button"
            onClick={ onCancel }>
            Cancel
          </button>
        </div>
      </CardBody>
    </Card>
  );

}
