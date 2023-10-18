import { Card, CardTitle, CardBody } from 'reactstrap';
import NameInput from './NameInput';


export function DefaultWindow({ active, fileTree, AddProjectButton, InstallPackageButton }) {

  console.log('ft: ', fileTree);
  return !active ? null : (
    <Card className="default-window">
      <CardBody className="default-window-container">
        <h4>HarperDB Applications Editor</h4>
        <ul>
          <li><AddProjectButton /></li>
          <li><InstallPackageButton /></li>
          {
            fileTree?.entries.length > 0 &&
            <li><i className="menu-pointer-icon fa fa-arrow-left" /> <span style={{ color: 'white' }}>or choose a file from the menu on the left</span></li>
          }
        </ul>
      </CardBody>
    </Card>
  );

}
