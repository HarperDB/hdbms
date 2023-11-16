import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import cn from 'classnames';
import Select from 'react-select';
import { ensureRepoExists, getGithubTags } from './lib';

export default function GithubRepoSelector({ pkg, setPackageSpec }) {
  const [user, setUser] = useState(pkg?.user || '');
  const [debouncedUser] = useDebounce(user, 300);

  const [repo, setRepo] = useState(pkg?.repo || '');
  const [debouncedRepo] = useDebounce(repo, 300);

  const [tags, setTags] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [tagsFetched, setTagsFetched] = useState(false);

  const [selectedTag, setSelectedTag] = useState(pkg?.tag || '');
  const [targetRepo, setTargetRepo] = useState('');

  const [loadingTags, setLoadingTags] = useState(false);
  const [found, setFound] = useState(false);

  useEffect(() => {
    setUser(pkg?.user || '');
    setRepo(pkg?.repo || '');
    setTags(pkg?.tag ? [pkg?.tag] : []);
    setSelectedTag(pkg?.tag || '');
  }, [pkg]);

  // TODO: use named hook callbacks
  useEffect(() => {
    if (debouncedUser && debouncedRepo) {
      setLoadingTags(true);
      ensureRepoExists(user, debouncedRepo)
        .then((targetRepoName) => {
          if (targetRepoName) {
            setTargetRepo(targetRepoName);
            setFound(true);

            getGithubTags(user, debouncedRepo).then((repoTags) => {
              setLoadingTags(false);
              setTagsFetched(true);
              setTags(repoTags);
            });
          } else {
            setLoadingTags(false);
            setFound(false);
            setTargetRepo('');
            setTags([]);
          }
        })
        .catch(() => {
          setLoadingTags(false);
        });
    } else {
      setFound(false);
      setLoadingTags(false);

      setTags([]);
      setSelectedTag('');
    }
  }, [debouncedUser, debouncedRepo, user]);

  // TODO: use named hook callbacks
  useEffect(() => {
    if (!(user && repo && targetRepo)) {
      setPackageSpec('');
    } else {
      const packageSpec = selectedTag ? `${user}/${repo}#semver:${selectedTag}` : `${user}/${repo}`;
      setPackageSpec(packageSpec);
    }
  }, [targetRepo, selectedTag, user, setPackageSpec, repo]);

  return (
    <>
      <div className="input-group">
        <input title="Github User" className="mt-2 form-control" placeholder="Github User" onChange={(e) => setUser(e.target.value)} value={user} />
        <div className="input-group-append">
          <i
            className={cn('input-group-text fa mt-2', {
              'text-danger fa-spinner fa-spin loading': loadingTags,
              'text-success fa-check found': debouncedUser.length > 0 && debouncedRepo.length > 0 && found,
              'text-danger fa-times not-found': debouncedRepo.length > 0 && debouncedUser.length > 0 && !(loadingTags || found),
              'text-danger fa-check not-searching': debouncedUser.length === 0 || debouncedRepo.length === 0,
            })}
          />
        </div>
      </div>

      <input title="Github Repo" className="mt-2" placeholder="Github Repo" onChange={(e) => setRepo(e.target.value)} value={repo} />

      <Select
        className="react-select-container github-tag-select mt-2"
        classNamePrefix="react-select"
        isDisabled={!targetRepo}
        isSearchable
        placeholder="Choose a tag"
        onChange={(selected) => {
          setSelectedTag(selected.value);
        }}
        options={tags.map((t) => ({
          label: t,
          value: t,
        }))}
      />
    </>
  );
}
