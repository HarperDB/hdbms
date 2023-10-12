import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import cn from 'classnames';

import { isValidProjectName } from './lib';

export function NpmInstallWindow({ projectName, installed, onConfirm, pkg, deployTargets, setPackageSpec }) {

  /*
   * packageQuery is what's in the input field (@scope/package)
   * matchingPackage is the name of the package that matches the search exactly
   */

  const [ packageQuery, setPackageQuery ] = useState('');
  const [ debouncedPackageQuery ] = useDebounce(packageQuery, 300);
  const [ distTags, setDistTags ] = useState('');
  const [ selectedDistTag, setSelectedDistTag ] = useState('');
  const [ matchingPackage, setMatchingPackage ] = useState('');
  const getPackageButtonLanguage = installed ? 'Reinstall Package' : 'Get Package';

  // for package query status icons
  const [ loadingTags, setLoadingTags ] = useState(false);
  const [ found, setFound ] = useState(false);


  function updatePackageQuery(e) {
    setPackageQuery(e.target.value);
  }

  function updateSelectedDistTag(e) {

    setSelectedDistTag(e.target.value);
  }

  useEffect(() => {
    setPackageQuery(pkg?.package || '');
  }, [pkg]);


  // searches npm using current, debounced query
  // returns an exactly matching package name if it exists
  // loads available tags if package name exists

  useEffect(() => {

    if (matchingPackage && projectName && isValidProjectName(projectName)) {
      const npmPackageSpecifier = selectedDistTag ? `${matchingPackage}@${selectedDistTag}` : matchingPackage;
      setPackageSpec(npmPackageSpecifier);
    }

  }, [matchingPackage, projectName]);

  function updatePackageAndTags() {


    if (debouncedPackageQuery) {

      setLoadingTags(true);
      findNpmPackageName(debouncedPackageQuery).then(packageName => {

        setLoadingTags(false);
        setFound(!!packageName);
        setMatchingPackage(packageName);


        if (packageName) {


          getNpmDistTags(packageName).then(tags => {
            setDistTags(tags);
            setSelectedDistTag(null);
          }).catch(e => {
            throw e;
          });

        }

      }).catch(e => {
        setLoadingTags(false);
      });

    } else {
      setMatchingPackage(null);
      setDistTags(null);
      setSelectedDistTag(null);
    }

  }

  useEffect(updatePackageAndTags, [debouncedPackageQuery]);

  return (
    <div className="install-window npm-install">
      <div className="npm-package-search-box">
        <input
          title="npm package specifier"
          value={packageQuery}
          placeholder="[@scope]/package"
          onChange={ updatePackageQuery } />
        <span className="search-status-icon-container">
          <i className={
              cn("search-status-icon fas", { 
                "fa-spinner fa-spin loading": loadingTags, 
                "fa-check found": debouncedPackageQuery.length > 0 && found,
                "fa-times not-found": debouncedPackageQuery.length > 0 && !(loadingTags || found), 
                "fa-check not-searching": debouncedPackageQuery.length === 0
              })
             } />
        </span>
      </div>
      <select
        onChange={ updateSelectedDistTag }
        className="npm-dist-tag-list"
        disabled={!distTags}>
        <option value='' >
          choose a tag
        </option>
        {
          Object.entries(distTags || []).map(([tagName,tagValue]) => (
            <option key={tagName} value={tagName}>{`${tagName} (${tagValue})`}</option>
          ))

        }
      </select>
      { 
        /*
      <button
        className="get-package-button"
        disabled={ !(matchingPackage && projectName && isValidProjectName(projectName) ) }
        onClick={
          () => {
            // note: i am not currently differentiating between '@org/pkg' and 'pkg' here.
            const npmPackageSpecifier = selectedDistTag ? `${matchingPackage}@${selectedDistTag}` : matchingPackage;
            onConfirm(projectName, npmPackageSpecifier, deployTargets);
          }
        }>{ getPackageButtonLanguage }</button>
        */ 
     }
    </div>
  );

}

async function findNpmPackageName(query) {

  const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${query}`);
  const packages = await response.json();
  const pkg = packages.objects.find(p => p.package.name === query);

  return pkg?.package?.name;

}

async function getNpmDistTags(packageName) {

  // searching for a non-existent package via https://registry.npmjs.org/<packageName> will throw a cors error
  // so instead, we search for repo using api /search endpoint, compare desired package name
  // against the returned results array. If one exactly matches, that package exists.
  // When the package exists, we can then look it up against the registry by its package name (avoiding cors error)
  // and grab the resulting 'dist-tags' property from the returned payload.

  const packageResponse = await fetch(`https://registry.npmjs.org/${packageName}`);
  const packageResponseData = await packageResponse.json();

  return packageResponseData['dist-tags'];

}

