import React, { useState, useEffect } from 'react';
import { Button, Input } from 'reactstrap';
import cn from 'classnames';
import Select from 'react-select';

import { isValidProjectName, parsePackageType } from './lib';
import GithubRepoSelector from './GithubRepoSelector';
import NpmPackageSelector from './NpmPackageSelector';
import UrlInstallField from './UrlInstallField';

export default function PackageInstallWindow({ selectedPackage, onConfirm, onCancel, deployTargets: availableDeployTargets, active }) {
  const defaultPackageType = false;
  const [installed, setInstalled] = useState(Boolean(selectedPackage));
  const [packageInfo, setPackageInfo] = useState(parsePackageType(selectedPackage));
  const [packageType, setPackageType] = useState(packageInfo?.type || defaultPackageType);
  const [projectName, setProjectName] = useState(selectedPackage?.name || '');
  const [projectNameIsValid, setProjectNameIsValid] = useState(true);
  const [packageSpec, setPackageSpec] = useState('');
  const [loading, setLoading] = useState(false);
  const [deployTargets, setDeployTargets] = useState([]);

  function updatePackageInfo() {
    const newPackageInfo = parsePackageType(selectedPackage);

    setProjectName(selectedPackage?.name || '');
    setPackageInfo(parsePackageType(selectedPackage));
    setPackageType(newPackageInfo?.type || defaultPackageType);
    setInstalled(Boolean(selectedPackage));
  }

  function updateSelectedPackageType({ value }) {
    setPackageType(value);
  }

  function validateProjectName() {
    setProjectNameIsValid(isValidProjectName(projectName));
  }

  useEffect(updatePackageInfo, [selectedPackage, defaultPackageType]);
  useEffect(validateProjectName, [projectName]);

  return !active ? null : (
    <div className="content-window">
      <h4 className="mb-5">Install A Package</h4>

      <Input
        valid={projectNameIsValid && projectName.length > 0}
        title="enter a name for this package"
        value={projectName}
        placeholder="Project Name"
        onChange={(e) => {
          setProjectName(e.target.value);
          setProjectNameIsValid(isValidProjectName(e.target.value));
        }}
      />

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

      <Select
        className="react-select-container mt-2"
        classNamePrefix="react-select"
        placeholder="How would you like to fetch this package?"
        onChange={updateSelectedPackageType}
        options={[
          {
            label: 'A Public GitHub Repo',
            value: 'github',
          },
          {
            label: 'Install a gzipped .tar file from a URL',
            value: 'url',
          },
        ]}
      />

      {!projectNameIsValid && projectName.length > 0 && (
        <span className="text-danger text-center mt-3">
          <i className="fa fa-exclamation-triangle" />
          <br />
          <span className="mt-2">Project name limited to alphanumeric, dashes, &amp; underscores.</span>
        </span>
      )}

      {projectNameIsValid && deployTargets.length > 0 && (
        <>
          <hr className="my-3" />

          {packageType === 'npm' && <NpmPackageSelector projectName={projectName} installed={installed} pkg={packageInfo} setPackageSpec={setPackageSpec} />}
          {packageType === 'github' && <GithubRepoSelector projectName={projectName} installed={installed} pkg={packageInfo} setPackageSpec={setPackageSpec} />}
          {packageType === 'url' && <UrlInstallField projectName={projectName} installed={installed} pkg={packageInfo} setPackageSpec={setPackageSpec} />}
        </>
      )}

      {projectNameIsValid && deployTargets.length > 0 && packageType && (
        <>
          <hr className="my-3" />

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
        </>
      )}
    </div>
  );
}
