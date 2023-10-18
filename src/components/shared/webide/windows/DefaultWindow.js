import { Card, CardTitle, CardBody } from 'reactstrap';
import NameInput from './NameInput';


export function DefaultWindow({ active, fileTree, AddProjectButton, InstallPackageButton }) {

  return !active ? null : (
    <Card className="default-window">
      <CardBody className="default-window-container">
        <h4>HarperDB Applications Editor</h4>
        <ul>
          <li><AddProjectButton /> create a new project </li>
          <li><InstallPackageButton /> download a remote package </li>
          {
            fileTree?.entries.length &&
            <li><i className="menu-pointer-icon fa fa-arrow-left" /> or choose a file from the menu on the left</li>
          }
        </ul>
      </CardBody>
    </Card>
  );

}
