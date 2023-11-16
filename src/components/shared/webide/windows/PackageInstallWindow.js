import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'reactstrap';
import cn from 'classnames';
import Select from 'react-select';

import { isValidProjectName, parsePackageType } from './lib';
import GithubRepoSelector from './GithubRepoSelector';
import NpmPackageSelector from './NpmPackageSelector';
import UrlInstallField from './UrlInstallField';

export default function PackageInstallWindow({ selectedPackage, onConfirm, onCancel, deployTargets: availableDeployTargets }) {
  const packageTypes = ['npm', 'github', 'url'];
  const defaultPackageType = packageTypes[0];

  const [installed, setInstalled] = useState(Boolean(selectedPackage));

  const [packageInfo, setPackageInfo] = useState(parsePackageType(selectedPackage));
  const [packageType, setPackageType] = useState(packageInfo?.type || defaultPackageType);

  const [projectName, setProjectName] = useState(selectedPackage?.name || '');
  const [projectNameIsValid, setProjectNameIsValid] = useState(true);

  const [packageSpec, setPackageSpec] = useState('');
  const [loading, setLoading] = useState(false);

  // result: 'packageSpec' gets sent to harperdb and installed by npm

  const [deployTargets, setDeployTargets] = useState([]);

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

  useEffect(updatePackageInfo, [selectedPackage, defaultPackageType]);
  useEffect(validateProjectName, [projectName]);

  return (
    <div
      className={cn('content-window', {
        github: packageType === 'github',
        npm: packageType === 'npm',
        url: packageType === 'url',
      })}
    >
      <h4 className="mb-5">Install A Package</h4>

      <Row className="mb-3 w-100">
        {packageTypes.map((pkgType, index) => (
          <Col xs="4" key={pkgType}>
            <Row>
              <Col xs="4" className="text-right">
                <input
                  title={`${pkgType} package`}
                  disabled={
                    /* when we have an existing selected package, the selection is pre-defined */
                    selectedPackage && packageInfo?.type !== pkgType
                  }
                  onChange={updateSelectedPackageType}
                  checked={pkgType === packageType}
                  value={packageTypes[index]}
                  type="radio"
                  name="package-option"
                />
              </Col>
              <Col xs="8">
                {pkgType === 'npm' && <i className="fab fa-npm fa-3x mt-0" />}
                {pkgType === 'github' && <i className="fab fa-github fa-2x mt-2" />}
                {pkgType === 'url' && <i className="fas fa-download fa-2x mt-2" />}
              </Col>
            </Row>
          </Col>
        ))}
      </Row>

      <input
        className={cn('project-name-input', {
          invalid: !projectNameIsValid && projectName.length > 0,
        })}
        title="enter a name for this package"
        value={projectName}
        placeholder="Project Name"
        onChange={(e) => {
          setProjectName(e.target.value);
          setProjectNameIsValid(isValidProjectName(e.target.value));
        }}
      />

      {!projectNameIsValid && projectName.length > 0 && (
        <span className="project-name-invalid-text">
          <i title="Your project name must only contain alphanumerics, dashes or underscores." className="project-name-invalid fa fa-warning" />
          Your project name must only contain alphanumerics, dashes or underscores.
        </span>
      )}

      {packageType === 'npm' && <NpmPackageSelector projectName={projectName} installed={installed} pkg={packageInfo} setPackageSpec={setPackageSpec} />}
      {packageType === 'github' && <GithubRepoSelector projectName={projectName} installed={installed} pkg={packageInfo} setPackageSpec={setPackageSpec} />}
      {packageType === 'url' && <UrlInstallField projectName={projectName} installed={installed} pkg={packageInfo} setPackageSpec={setPackageSpec} />}

      <Select
        className="react-select-container package-install-deploy-targets-dropdown mt-2"
        classNamePrefix="react-select"
        isSearchable
        isMulti
        placeholder="Choose your deploy targets"
        onChange={(selected) => {
          const selectedHostUrls = selected.map((o) => o.value);
          const updatedDeployTargets = availableDeployTargets.filter((t) => selectedHostUrls.includes(t.instance.url));

          setDeployTargets(updatedDeployTargets);
        }}
        options={availableDeployTargets.map((t) => ({
          label: t.instance.instance_name,
          value: t.instance.url,
        }))}
      />

      <Button
        onClick={async () => {
          setLoading(true);
          try {
            await onConfirm(projectName, packageSpec, deployTargets);
          } catch (e) {
            setLoading(false);
          }
          setLoading(false);
        }}
        className={cn('btn btn-block btn-success mt-3', { loading })}
        disabled={!isValidProjectName(projectName) || !packageSpec || !deployTargets.length}
      >
        {loading ? <i className="install-package-status-icon fa fa-spinner fa-spin" /> : 'Install Package'}
      </Button>
      <Button onClick={onCancel} className="btn btn-block btn-outline-success mt-2">
        Cancel
      </Button>
    </div>
  );
}
