import React, { useCallback } from 'react';
import { Button } from 'reactstrap';

function CardFrontIcons({ loading, status, customer_name, setFlipState, total_instance_count }) {
  const handleCardFlipIconClick = useCallback(
    (e) => {
      e.stopPropagation();
      const action = e.currentTarget.getAttribute('data-action');
      if (action === 'delete' && total_instance_count) {
        alert.error('You must remove all instances from an Organization before deleting it.');
      } else {
        setFlipState(action);
      }
    },
    [total_instance_count, setFlipState]
  );

  return loading ? (
    <i className="status-icon fa fa-spinner fa-spin text-purple" />
  ) : status === 'accepted' ? (
    <Button data-action="leave" className="status-icon" color="link" title={`Leave ${customer_name} organization`} onClick={handleCardFlipIconClick}>
      <i className="fa fa-times-circle text-purple" />
    </Button>
  ) : status === 'owner' ? (
    <Button data-action="delete" className="status-icon" color="link" title={`Delete ${customer_name} organization`} onClick={handleCardFlipIconClick}>
      <i className={`fa fa-trash delete text-purple ${total_instance_count ? 'disabled' : ''}`} />
    </Button>
  ) : null;
}

export default CardFrontIcons;
