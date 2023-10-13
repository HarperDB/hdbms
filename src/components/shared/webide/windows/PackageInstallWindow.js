import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Button, Card } from 'reactstrap';
import cn from 'classnames';
import Select from 'react-select';

import { isValidProjectName } from './lib';
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

  console.log(deployTargets);
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

  useEffect(updatePackageInfo, [selectedPackage]);
  useEffect(validateProjectName, [ projectName ]);

  return (
    <div className="install-package-form">
      <Card className="package-type">
      {
        packageTypes.map((pkgType, index) => (
          <label key={ pkgType }>
            { pkgType === 'npm' && <i className="install-package-icon fab fa-npm" /> }
            { pkgType === 'github' && <i className="install-package-icon fab fa-github" /> }
            { pkgType === 'url' && <i className="install-package-icon fas fa-link" /> }
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
          </label>
        ))
      }
      </Card>
      <Card className="install-fields">
        <label className="project-name-field">
          Project Name:
        </label>
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
        <label>Deploy Targets:</label>
          <Select
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
              //'loading': loadingTags
            })
          }
          disabled={ !isValidProjectName(projectName) || !packageSpec || !deployTargets.length }>Deploy Package</Button>

      </Card>
    </div>
  );
}


function parsePackageType(pkg) {

  if (!pkg) {
    return null;
  }

  let meta = {
    type: null,
    user: null,
    repo: null,
    url: null,
    package: null,
    tag: null
  };

  if (pkg.url.match('://')) {

    // it's a url
    meta.url = pkg.url;
    meta.type = 'url';

  } else if (pkg.url.match('semver:')) {
    // it's a github repo
    const [ user, repo, semverTag ] = pkg.url.split(/[/#]/);
    meta.type = 'github';
    meta.user = user;
    meta.repo = repo;
    meta.tag = semverTag.replace('semver:','');
  } else {

    meta.type = 'npm';
    const parts = pkg.url.split('/');

    // TODO: what should this format be?
    // what does the form need?

    if (parts.length === 1) {
    // no scope, e.g harperdb[@2], not @harperdb/harperdb[@2]

      const [ p, tag ] = parts[0].split('@');

      meta.package = p;
      meta.tag = tag;

    } else if (parts.length == 2) {
    // has @scope, e.g @harperdb/harperdb[@2]

      const [ scope, pkgAndTag ] = parts;
      const [ p, tag ] = pkgAndTag.split('@');

      meta.package = p;
      meta.tag = tag;

    }

  }

  return meta;

}
