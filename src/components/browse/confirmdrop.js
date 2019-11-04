import React from 'react';
import { Button, Row, Col, Modal, ModalBody, ModalHeader } from '@nio/ui-kit';

export default ({ itemName, itemType, affirmativeMethod, cancelMethod }) => {
  const confirmAndClose = () => {
    affirmativeMethod(itemName);
    cancelMethod();
  };

  return (
    <Modal isOpen={!!itemName} toggle={cancelMethod}>
      <ModalHeader>
        Confirm Drop <span className="text-capitalize">{itemType}</span>
      </ModalHeader>
      <ModalBody>
        You are about to drop the &quot;{itemName}&quot; {itemType}.<br /><br />
        This cannot be undone. It reeks of hubris. Are you sure?

        <hr />

        <Row>
          <Col sm="6" className="mb-2">
            <Button block color="purple" outline onClick={cancelMethod}>No, Cancel</Button>
          </Col>
          <Col sm="6">
            <Button block color="purple" onClick={confirmAndClose}>Yes, Delete {itemName}</Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};
