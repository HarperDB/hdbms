import React, { useEffect, useState } from 'react';
import cn from 'classnames';

export function UrlInstallWindow({ onConfirm, installed, projectName, pkg, deployTargets }) {

  const [ packageUrl, setPackageUrl ] = useState(pkg?.url || '');
  const [ isValidPackageUrl, setIsValidPackageUrl ] = useState(false);

  const getPackageButtonLanguage = installed ? 'Reinstall Package' : 'Get Package';

  useEffect(() => {
    
  }, [pkg]);

  return (
    <div className="install-window url-install">
      <input
        title="url pointing to a tarball"
        className={
          cn("package-url-input", {
            invalid: !isValidPackageUrl
          })
        }
        value={ packageUrl }
        onChange={
          (e) => {
            setIsValidPackageUrl(e.target.value.length === 0 || isValidTarballUrl(e.target.value));
            setPackageUrl(e.target.value);
          }
        }
        placeholder="url to gzipped tarball" />
    {/*
      <button
        className="get-package-button"
        disabled={!(packageUrl && projectName && isValidProjectName(projectName) )}
        onClick={ (e) => onConfirm(projectName, packageUrl, deployTargets) }>{ getPackageButtonLanguage }</button>
        */ }
    </div>
  );

}

function isValidTarballUrl(url) {
  // npm restrictions on tarball url install here: https://docs.npmjs.com/cli/v9/commands/npm-install
  return isValidUrl(url) && (url.endsWith('.tar') || url.endsWith('.tar.gz') || url.endsWith('.tgz'));
}

function isValidUrl(url) {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
}
