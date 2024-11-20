import React, { useCallback } from 'react';
import { Button } from 'reactstrap';
import { useAlert } from 'react-alert';
function CardFrontIcons({
  loading,
  status,
  customerName,
  setFlipState,
  totalInstanceCount
}) {
  const alert = useAlert();
  const handleCardFlipIconClick = useCallback(e => {
    e.stopPropagation();
    const action = e.currentTarget.getAttribute('data-action');
    if (action === 'delete' && totalInstanceCount) {
      alert.error('You must remove all instances from an Organization before deleting it.');
    } else {
      setFlipState(action);
    }
  }, [totalInstanceCount, alert, setFlipState]);
  return loading ? <i className="status-icon fa fa-spinner fa-spin text-purple" /> : status === 'accepted' ? <Button data-action="leave" className="status-icon" color="link" title={`Leave ${customerName} organization`} onClick={handleCardFlipIconClick}>
      <i className="fa fa-times-circle text-purple" />
    </Button> : status === 'owner' ? <Button data-action="delete" className="status-icon" color="link" title={`Delete ${customerName} organization`} onClick={handleCardFlipIconClick}>
      <i className={`fa fa-trash delete text-purple ${totalInstanceCount ? 'disabled' : ''}`} />
    </Button> : null;
}
export default CardFrontIcons;