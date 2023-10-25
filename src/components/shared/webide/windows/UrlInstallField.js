import React, { useEffect, useState } from 'react';
import cn from 'classnames';

function isValidUrl(url) {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
}

function isValidTarballUrl(url) {
  // npm restrictions on the tarball url install here: https://docs.npmjs.com/cli/v9/commands/npm-install
  return isValidUrl(url) && (url.endsWith('.tar') || url.endsWith('.tar.gz') || url.endsWith('.tgz'));
}

export default function UrlInstallField({ pkg, setPackageSpec }) {

  const [ packageUrl, setPackageUrl ] = useState(pkg?.url || '');
  const [ isValidPackageUrl, setIsValidPackageUrl ] = useState(isValidTarballUrl(pkg?.url));

  useEffect(() => {
    setPackageSpec(isValidPackageUrl ? packageUrl : '');
  }, [packageUrl, isValidPackageUrl, setPackageSpec]);

  return (
    <div className="install-window url-install">
      <label htmlFor="tarball-url" className="form-label">URL:</label>
      <input
        type="text"
        id="tarball-url"
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

