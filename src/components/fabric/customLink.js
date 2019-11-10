import { LinkDefault } from '@mrblenny/react-flow-chart';
import { Button } from '@nio/ui-kit';
import React from 'react';

export default (props, handleClick) => {
  const { startPos, endPos, link } = props;
  const centerX = (startPos.x + endPos.x) / 2 - 41;
  const centerY = (startPos.y + endPos.y) / 2 - 50;
  return (
    <>
      <LinkDefault {...props} />
      <div style={{ position: 'absolute', left: centerX, top: centerY }}>
        <Button color="purple" onClick={(e) => handleClick(e, link)}>
          <i className="fa fa-edit" />
        </Button>
      </div>
    </>
  );
};
