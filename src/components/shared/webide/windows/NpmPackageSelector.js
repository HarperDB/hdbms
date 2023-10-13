import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import cn from 'classnames';
import Select from 'react-select';

import {

  findNpmPackageName,
  getNpmDistTags,
  isValidProjectName

} from './lib';

export function NpmPackageSelector({ installed, onConfirm, pkg, setPackageSpec }) {

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


  // result is a packageSepc
  // for package query status icons
  const [ loadingTags, setLoadingTags ] = useState(false);
  const [ found, setFound ] = useState(false);


  function updatePackageQuery(e) {
    setPackageQuery(e.target.value);
  }

  function updateSelectedDistTag(value) {
    setSelectedDistTag(value);
  }

  useEffect(() => {

    setPackageQuery(pkg?.package || '');
  }, [pkg]);


  // searches npm using current, debounced query
  // returns an exactly matching package name if it exists
  // loads available tags if package name exists

  function updatePackageSpec() {
    if (matchingPackage) {
      const npmPackageSpecifier = selectedDistTag ? `${matchingPackage}@${selectedDistTag}` : matchingPackage;
      setPackageSpec(npmPackageSpecifier);
    } else {
      setPackageSpec('');
    }
  }

  useEffect(updatePackageSpec, [matchingPackage, selectedDistTag]);

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
        <label>Npm Package:</label>
        <input
          title="enter an npm package specifier"
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
    <label>Choose a Tag:</label>
      <Select
        isDisabled={!packageQuery}
        placeholder="choose a tag"
        className="npm-dist-tag-list"
        disabled={!distTags}
        onChange={ updateSelectedDistTag }
        options={
          Object.entries(distTags || []).map(([tagName,tagValue]) => ({
            label: `${tagName} (${tagValue})`,
            value: tagName
          }))
        } />
    </div>
  );

}
