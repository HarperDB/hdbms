import React, { useEffect, useState } from 'react';
import cn from 'classnames';

export function UrlInstallField({ onConfirm, installed, pkg, deployTargets, setPackageSpec }) {

  const [ packageUrl, setPackageUrl ] = useState(pkg?.url || '');
  const [ isValidPackageUrl, setIsValidPackageUrl ] = useState(isValidTarballUrl(pkg?.url));

  const getPackageButtonLanguage = installed ? 'Reinstall Package' : 'Get Package';

  useEffect(() => {
    setPackageSpec(isValidPackageUrl ? packageUrl : '');
  }, [packageUrl, isValidPackageUrl]);

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
    </div>
  );

}

function isValidTarballUrl(url) {
  // npm restrictions on the tarball url install here: https://docs.npmjs.com/cli/v9/commands/npm-install
  return isValidUrl(url) && (url.endsWith('.tar') || url.endsWith('.tar.gz') || url.endsWith('.tgz'));
}

function isValidUrl(url) {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
}
