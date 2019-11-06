import React, { useContext } from 'react';
import { Button, Row, Col, Modal, ModalBody, ModalHeader } from '@nio/ui-kit';
import useReactRouter from 'use-react-router';

import { HarperDBContext } from '../../providers/harperdb';

export default ({ itemName, itemType, activeSchema, close, baseUrl, update }) => {


  return (
    <Modal isOpen={!!itemName} toggle={close}>
      <ModalHeader>
        Confirm Drop <span className="text-capitalize">{itemType}</span>
      </ModalHeader>
      <ModalBody>
        You are about to drop the &quot;{itemName}&quot; {itemType}.<br /><br />
        This cannot be undone. It reeks of hubris. Are you sure?
        <hr />
        <Row>
          <Col sm="6" className="mb-2">
            <Button block color="purple" outline onClick={() => close()}>No, Cancel</Button>
          </Col>
          <Col sm="6">
            <Button block color="purple" onClick={dropItem}>Yes, Delete {itemName}</Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};
