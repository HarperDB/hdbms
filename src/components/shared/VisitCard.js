import React from 'react';
import { Button } from 'reactstrap';

const VisitCard = ({ disabled, label, onClick }) => (
  <Button onClick={onClick} title={label} block disabled={disabled} color="danger" className="mt-2" id="visitCreditCard">
    {label}
  </Button>
);

export default VisitCard;
