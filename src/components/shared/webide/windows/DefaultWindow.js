import { Card, CardTitle, CardBody } from 'reactstrap';
import NameInput from './NameInput';


export function DefaultWindow({ active, fileTree }) {

  return !active ? null : (
    <Card className="default-window">
      <CardBody className="default-window-container">
      {
        fileTree.entries?.length ?
          'Please create or select a file on the left' :
          'Please create a project on the left'
      }
      </CardBody>
    </Card>
  );

}
