import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import cn from 'classnames';
import Select from 'react-select';
import { ensureRepoExists, getGithubTags } from './lib';

export function GithubRepoSelector({ onConfirm, installed, projectName, pkg, setPackageSpec }) {

  const [ user, setUser ] = useState(pkg?.user || '');
  const [ debouncedUser ] = useDebounce(user, 300);

  const [ repo, setRepo ] = useState(pkg?.repo || '');
  const [ debouncedRepo ] = useDebounce(repo, 300);

  const [ tags, setTags ] = useState([]);
  const [ tagsFetched, setTagsFetched ] = useState(false);

  const [ selectedTag, setSelectedTag ] = useState(pkg?.tag || '');
  const [ targetRepo, setTargetRepo ] = useState('');

  const [ loadingTags, setLoadingTags ] = useState(false);
  const [ found, setFound ] = useState(false);

  const getPackageButtonLanguage = installed ? 'Reinstall Package' : 'Get Package';

  useEffect(() => {

    setUser(pkg?.user || '');
    setRepo(pkg?.repo || '');
    setTags(pkg?.tag ? [ pkg?.tag ] : []);
    setSelectedTag(pkg?.tag || '');

  }, [pkg]);

  useEffect(() => {

    if (debouncedUser && debouncedRepo) {

      setLoadingTags(true);
      ensureRepoExists(user, debouncedRepo).then((targetRepoName) => {

        if (targetRepoName) {

          setTargetRepo(targetRepoName);
          setFound(true);

          getGithubTags(user, debouncedRepo).then(repoTags => {

            setLoadingTags(false);
            setTagsFetched(true);
            setTags(repoTags);

          })

        } else {

          setLoadingTags(false);
          setFound(false);
          setTargetRepo('');
          setTags([]);

        }

      }).catch(e => {
        setLoadingTags(false);
      });

    } else {

      setFound(false);
      setLoadingTags(false);

      setTags([]);
      setSelectedTag('');
    }

  }, [debouncedUser, debouncedRepo]);

  useEffect(() => {

    if (!(user && repo && targetRepo)) {
      setPackageSpec('');
    } else {
      const packageSpec = selectedTag ? `${user}/${repo}#semver:${selectedTag}` : `${user}/${repo}`; 
      setPackageSpec(packageSpec);
    }

  }, [targetRepo, selectedTag]);

  return (
      <div className="package-install-github-query-container">
        <div className="package-install-github-user">
          <label className="form-label">Github User:</label>
          <input
            title="Github User"
            placeholder="Github User"
            onChange={ (e) => setUser(e.target.value) }
            value={user} />
        </div>
        <div className="package-install-github-repo-lookup">
          <label className="form-label">Github Repository Name: </label>
          <div className="github-package-search-box">
            <input
              title="Github Repo"
              placeholder="Github Repo"
              onChange={ (e) => setRepo(e.target.value) }
              value={repo} />
            <span className="search-status-icon-container github-repo-query">
              <i className={
                cn("search-status-icon fas", { 
                  "fa-spinner fa-spin loading": loadingTags, 
                  "fa-check found": debouncedUser.length > 0 && debouncedRepo.length > 0 && found,
                  "fa-times not-found": debouncedRepo.length > 0 && debouncedUser.length > 0 && !(loadingTags || found), 
                  "fa-check not-searching": debouncedUser.length === 0 || debouncedRepo.length === 0
                })
              } />
            </span>
        </div>
    </div>
    <Select 
      className="react-select-container github-tag-select"
      classNamePrefix="react-select"
      isDisabled={!targetRepo}
      isSearchable={true}
      placeholder='choose a tag'
      onChange={
        (selected) => {
          setSelectedTag(selected.value);
        }
      }
      options={
        tags.map(t => ({
          label: t,
          value: t
        }))
    } />
    </div>
  );
}
