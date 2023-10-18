import { Card, CardTitle, CardBody } from 'reactstrap';
import NameInput from './NameInput';


export function DefaultWindow({ active, fileTree, AddProjectButton, InstallPackageButton }) {

  return !active ? null : (
    <Card className="default-window">
      <CardBody className="default-window-container">
        <h4>HarperDB Applications Editor</h4>
        <ul className="default-window-options-list">
          <li className="default-window-option"><AddProjectButton /></li>
          <li className="default-window-option"><InstallPackageButton /></li>
          {
            fileTree?.entries.length > 0 &&
            <li className="default-window-option">
              <i className="menu-pointer-icon fa fa-arrow-left" /> <span style={{ color: 'white' }}>Choose a file from the menu on the left</span>
            </li>
          }
        </ul>
      </CardBody>
    </Card>
  );

}
