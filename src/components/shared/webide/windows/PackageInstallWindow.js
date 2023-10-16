import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Label, Button, Card } from 'reactstrap';
import cn from 'classnames';
import Select from 'react-select';

import { isValidProjectName, parsePackageType } from './lib';
import { GithubRepoSelector } from './GithubRepoSelector';
import { NpmPackageSelector } from './NpmPackageSelector';
import { UrlInstallField } from './UrlInstallField';

export function PackageInstallWindow({ selectedPackage, onConfirm, onCancel, onPackageChange, deployTargets: availableDeployTargets }) {

  const packageTypes = [ 'npm', 'github', 'url' ];

  const [ installed, setInstalled ] = useState(Boolean(selectedPackage));

  const [ packageInfo, setPackageInfo ] = useState(parsePackageType(selectedPackage));
  const [ packageType, setPackageType ] = useState(packageInfo?.type || packageTypes[0]);

  const [ projectName, setProjectName ] = useState(selectedPackage?.name || '');
  const [ projectNameIsValid, setProjectNameIsValid ] = useState(true);

  const [ packageSpec, setPackageSpec ] = useState('');

  // result: 'packageSpec' gets sent to harperdb and installed by npm

  const [ deployTargets, setDeployTargets ] = useState([]);

  function updatePackageInfo() {

    const newPackageInfo = parsePackageType(selectedPackage); 

    setProjectName(selectedPackage?.name || '');
    setPackageInfo(parsePackageType(selectedPackage));
    setPackageType(newPackageInfo?.type || packageTypes[0]);
    setInstalled(Boolean(selectedPackage));

  }

  function updateSelectedPackageType(e) {
    setPackageType(e.target.value);
  }

  function validateProjectName() {
    setProjectNameIsValid(isValidProjectName(projectName));
  }

  useEffect(updatePackageInfo, [ selectedPackage ]);
  useEffect(validateProjectName, [ projectName ]);

  return (
    <div className="package-install-window">
      <Card className="package-install-source-form">
      {
        packageTypes.map((pkgType, index) => (
          <Label key={ pkgType }>
            { pkgType === 'npm' && <i className="package-install-source-icon fab fa-npm" /> }
            { pkgType === 'github' && <i className="package-install-source-icon fab fa-github" /> }
            { pkgType === 'url' && <i className="package-install-source-icon fas fa-link" /> }
            <input
              title={pkgType + ' package'}
              disabled={
                /* when we have an existing selected package, the selection is pre-defined */
                selectedPackage && packageInfo?.type !== pkgType
              }
              onChange={ updateSelectedPackageType }
              checked={ pkgType === packageType }
              value={ packageTypes[index] }
              type="radio"
              name="package-option" />
          </Label>
        ))
      }
      </Card>
      <Card className="package-install-details-form">
        <Label>Project Name:</Label>
        <input
          className={
            cn("project-name-input", {
              invalid: !projectNameIsValid && projectName.length > 0
            })
          }
          title="enter a name for this package"
          value={ projectName }
          placeholder="project name"
          onChange={
            (e) => {
              setProjectName(e.target.value);
              setProjectNameIsValid(isValidProjectName(e.target.value));
            }
          }/>
        {
          (!projectNameIsValid && projectName.length > 0) && 
          <i title="your project name must only contain alphanumerics, dashes or underscores."
             className="project-name-invalid fa fa-warning" /> 
        }
        {
          packageType === 'npm' &&
          <NpmPackageSelector
            onConfirm={ onConfirm }
            projectName={ projectName }
            installed={ installed }
            pkg={ packageInfo } 
            setPackageSpec = { setPackageSpec } />
        }
        {
          packageType === 'github' &&
          <GithubRepoSelector
            onConfirm={ onConfirm }
            projectName={ projectName }
            installed={ installed }
            pkg={ packageInfo }
            setPackageSpec = { setPackageSpec } />
        }
        {
          packageType === 'url' &&
          <UrlInstallField
            onConfirm={onConfirm}
            projectName={projectName}
            installed={installed}
            pkg={ packageInfo }
            setPackageSpec = { setPackageSpec } />
        }
        <Label>Deploy Targets:</Label>
        <Select
          className="react-select-container package-install-deploy-targets-dropdown"
          classNamePrefix="react-select"
          isSearchable={true}
          isMulti={true}
          onChange={
            (selected) => {

              const selectedHostUrls = selected.map(o => o.value);
              const updatedDeployTargets = availableDeployTargets.filter(t => selectedHostUrls.includes(t.instance.url));

              setDeployTargets(updatedDeployTargets);

            }
          }
          options={
            availableDeployTargets.map((t) => ({
              label: t.instance.host,
              value: t.instance.url
            }))
          } />
       <Button
         onClick={
            async () => {
              await onConfirm(projectName, packageSpec, deployTargets);
            }
          }
          className={
            cn("get-package-button", {
              'btn-success': true
              //'loading': loadingTags
            })
          }
          disabled={
            !isValidProjectName(projectName) || !packageSpec || !deployTargets.length 
          }>
          Deploy Package &nbsp;<i className="fa fa-rocket" />
       </Button>

      </Card>
    </div>
  );
}
