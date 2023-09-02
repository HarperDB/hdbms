import React from 'react';
import { Card } from 'reactstrap';

function EditorWindow({ children }) {

  /*
  const style = {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  */

  return (
    <Card className="editor-window">{ children }</Card>
  )

}

export default EditorWindow;
