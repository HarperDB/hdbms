import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

function ExampleManagerRow({ item, baseUrl, isActive }) {
  const navigate = useNavigate();

  const handleSetActive = () => (isActive ? false : navigate(`${baseUrl}/${item}`));

  return (
    <Row key={item} title={`View${isActive ? 'ing' : ''} ${item}`} className={`item-row ${isActive ? 'active' : ''}`} onClick={handleSetActive} tabIndex="0">
      <Col className="item-label">{item.toLowerCase()}</Col>
      <Col className="item-action">
        {isActive && (
          <Button tabIndex="-1" color="purple" className="round">
            <i className="fa fa-chevron-right" />
          </Button>
        )}
      </Col>
    </Row>
  );
}

export default ExampleManagerRow;
