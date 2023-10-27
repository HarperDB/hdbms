import React, { useState, useEffect } from 'react';
import { Label, Button, Card } from 'reactstrap';
import cn from 'classnames';
import Select from 'react-select';

import { isValidProjectName, parsePackageType } from './lib';
import GithubRepoSelector from './GithubRepoSelector';
import NpmPackageSelector from './NpmPackageSelector';
import UrlInstallField from './UrlInstallField';

export default function PackageInstallWindow({ selectedPackage, onConfirm, onCancel, deployTargets: availableDeployTargets }) {

  console.log(availableDeployTargets);
  const packageTypes = [ 'npm', 'github', 'url' ];
  const defaultPackageType = packageTypes[0];

  const [ installed, setInstalled ] = useState(Boolean(selectedPackage));

  const [ packageInfo, setPackageInfo ] = useState(parsePackageType(selectedPackage));
  const [ packageType, setPackageType ] = useState(packageInfo?.type || defaultPackageType);

  const [ projectName, setProjectName ] = useState(selectedPackage?.name || '');
  const [ projectNameIsValid, setProjectNameIsValid ] = useState(true);

  const [ packageSpec, setPackageSpec ] = useState('');
  const [ loading, setLoading ] = useState(false);

  // result: 'packageSpec' gets sent to harperdb and installed by npm

  const [ deployTargets, setDeployTargets ] = useState([]);

  function updatePackageInfo() {

    const newPackageInfo = parsePackageType(selectedPackage); 

    setProjectName(selectedPackage?.name || '');
    setPackageInfo(parsePackageType(selectedPackage));
    setPackageType(newPackageInfo?.type || defaultPackageType);
    setInstalled(Boolean(selectedPackage));

  }

  function updateSelectedPackageType(e) {
    setPackageType(e.target.value);
  }

  function validateProjectName() {
    setProjectNameIsValid(isValidProjectName(projectName));
  }

  useEffect(updatePackageInfo, [ selectedPackage, defaultPackageType ]);
  useEffect(validateProjectName, [ projectName ]);

  return (
    <Card className={ cn("package-install-window", {
      'github': packageType === 'github',
      'npm': packageType === 'npm',
      'url': packageType === 'url'
    }) }>
      <div className="package-install-window-title">Package Install</div>
      <div className="package-install-source-form">
      {
        packageTypes.map((pkgType, index) => (
          <div className="package-install-option-container" key={ pkgType }>
            { pkgType === 'npm' && <i className="package-install-source-icon fab fa-npm" /> }
            { pkgType === 'github' && <i className="package-install-source-icon fab fa-github" /> }
            { pkgType === 'url' && <i className="package-install-source-icon fas fa-link" /> }
            <input
              className='package-install-source-option'
              title={`${pkgType  } package`}
              disabled={
                /* when we have an existing selected package, the selection is pre-defined */
                selectedPackage && packageInfo?.type !== pkgType
              }
              onChange={ updateSelectedPackageType }
              checked={ pkgType === packageType }
              value={ packageTypes[index] }
              type="radio"
              name="package-option" />
          </div>
        ))
      }
      </div>
      <div className="package-install-details-form">

        <div className="package-install-input-container">
          <Label>Project Name:</Label>
          <input
            className={
              cn("project-name-input", {
                invalid: !projectNameIsValid && projectName.length > 0
              })
            }
            title="enter a name for this package"
            value={ projectName }
            placeholder="Project name"
            onChange={
              (e) => {
                setProjectName(e.target.value);
                setProjectNameIsValid(isValidProjectName(e.target.value));
              }
            }/>
        </div>

        {
          (!projectNameIsValid && projectName.length > 0) && 
          <span className="project-name-invalid-text">
            <i
              title="Your project name must only contain alphanumerics, dashes or underscores."
              className="project-name-invalid fa fa-warning" /> 
              Your project name must only contain alphanumerics, dashes or underscores.
          </span>
        }
        <div className="package-install-input-container">
        {
          packageType === 'npm' &&
          <NpmPackageSelector
            projectName={ projectName }
            installed={ installed }
            pkg={ packageInfo } 
            setPackageSpec = { setPackageSpec } />
        }
        {
          packageType === 'github' &&
          <GithubRepoSelector
            projectName={ projectName }
            installed={ installed }
            pkg={ packageInfo }
            setPackageSpec = { setPackageSpec } />
        }
        {
          packageType === 'url' &&
          <UrlInstallField
            projectName={projectName}
            installed={installed}
            pkg={ packageInfo }
            setPackageSpec = { setPackageSpec } />
        }
        </div>
        <div className="package-install-input-container">
          <Label>Deploy Targets:</Label>
          <Select
            className="react-select-container package-install-deploy-targets-dropdown"
            classNamePrefix="react-select"
            isSearchable
            isMulti
            onChange={
              (selected) => {

                const selectedHostUrls = selected.map(o => o.value);
                const updatedDeployTargets = availableDeployTargets.filter(t => selectedHostUrls.includes(t.instance.url));

                setDeployTargets(updatedDeployTargets);

              }
            }
            options={
              availableDeployTargets.map((t) => ({
                label: t.instance.instance_name,
                value: t.instance.url
              }))
            } />
        </div>
        <Button
          onClick={
             async () => {
               setLoading(true);

               try {
                 await onConfirm(projectName, packageSpec, deployTargets);
               } catch(e) {
                 setLoading(false);
               }

               setLoading(false);

             }
           }
           className={
             cn("install-package-button", {
               'btn-success': true,
               'loading': loading
             })
           }
           disabled={
             !isValidProjectName(projectName) || !packageSpec || !deployTargets.length 
           }>
           {
             loading ? <i className="install-package-status-icon fa fa-spinner fa-spin" /> : 'Install Package'
           }
        </Button>
        <Button
          onClick={ onCancel }
          className="btn btn-secondary btn-danger cancel-button">Cancel</Button>
        
      </div>
    </Card>
  );
}
