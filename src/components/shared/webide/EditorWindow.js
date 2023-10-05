import React, { useState, useEffect } from 'react';
import { Card } from 'reactstrap';
import NameInput from './NameInput';
import { useDebounce } from 'use-debounce';

export const EDITOR_WINDOWS = {
  DEFAULT_WINDOW: 'BLANK_WINDOW',
  BLANK_WINDOW: 'BLANK_WINDOW',
  CODE_EDITOR_WINDOW: 'CODE_EDITOR_WINDOW',
  NAME_FILE_WINDOW: 'NAME_FILE_WINDOW',
  NAME_PROJECT_WINDOW: 'NAME_PROJECT_WINDOW',
  NAME_PROJECT_FOLDER_WINDOW: 'NAME_PROJECT_FOLDER_WINDOW',
  RENAME_FILE_WINDOW: 'RENAME_FILE_WINDOW',
  RENAME_FOLDER_WINDOW: 'RENAME_FOLDER_WINDOW',
  DEPLOY_COMPONENT_WINDOW: 'DEPLOY_COMPONENT_WINDOW',
  INSTALL_PACKAGE_WINDOW: 'INSTALL_PACKAGE_WINDOW',
  PACKAGE_DETAILS_WINDOW: 'PACKAGE_DETAILS_WINDOW'
};

export function BlankWindow({ active, fileTree }) {
  return !active ? null : (
    <div className="blank-editor-window">
    {
      fileTree.entries?.length ? 'Please create or select a file on the left' : 'Please create a project on the left'
    }
    </div>
  )
}

export function NameProjectWindow({ active, onConfirm, onCancel }) {
  return !active ? null : (
    <NameInput
      label="New Project Name"
      onEnter={ onConfirm }
      onConfirm={ onConfirm }
      onCancel={ onCancel }
    />
  );
}

export function NameProjectFolderWindow({ active, onConfirm, onCancel, projectName }) {
  return !active ? null : (
    <NameInput
      label={`New Subdirectory Name for project '${projectName}'`}
      onConfirm={ onConfirm }
      onEnter={ onConfirm }
      onCancel={ onCancel }
    />
  );
}

export function NameFileWindow({ active, onConfirm, onCancel }) {
  return !active ? null : (
    <NameInput
      label="New File Name"
      onEnter={ onConfirm }
      onConfirm={ onConfirm }
      onCancel={ onCancel }
    />
  );
}

export function PackageDetailsWindow({ active, packageDetails }) {

  if (!active) {
    return null;
  }

  return (
    <div>
      <ul>
        <li>
          name: { packageDetails.name }
        </li>
        <li>
          url: { packageDetails.url }
        </li>
      </ul>
    </div>
  );

}

export function DeployComponentWindow({ active, project, onConfirm, onCancel, deployTargets=[] }) {

  const [ selectedTarget, setSelectedTarget ] = useState(deployTargets[0] || null);

  if (!active || !project)
    return null;

  function updateSelectedTarget(e) {

    const match = deployTargets.find(t => t.instance.instance_name === e.target.value);
    setSelectedTarget(match);

  }

  return (
    <div className="deploy-component-window">

      <div>Deploy <span className="deploy-component-project-name">{ project.name }</span> to another cloud instance</div>
      <br />
      <br />
      <select
        defaultValue="select a deploy target"
        autoFocus
        onChange={ updateSelectedTarget }
        name="deploy-targets"
        id="deploy-targets">
        {
          deployTargets.map(target => (
              <option key={target.instance.url} value={target.instance.instance_name}>
                {target.instance.instance_name} ({target.instance.url})
              </option>
            )
          )
        }
      </select>
      <br />
      <br />
      <div>
        <button
        disabled={ !selectedTarget }
        onClick={
          () => {
            onConfirm(project, selectedTarget);
          }
        }>Deploy</button>
      </div>
      <div>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

export function InstallPackageWindow({ active, selectedPackage, reinstallable, onConfirm, onCancel, onPackageChange }) {

  const packageTypes = ['npm', 'github', 'url' ];
  const [ url, tag ] = selectedPackage?.url?.split('#') || [];
  const [ packageName, setPackageName ] = useState(selectedPackage?.name || '');
  const [ packageUrl, setPackageUrl ] = useState(url || '');
  const [ releaseTag, setReleaseTag ] = useState(tag || '');
  const [ selectedPackageType, setSelectedPackageType ] = useState(packageTypes[0]);
  const [ packageSpec, setPackageSpec ] = useState('');
  const [ projectName, setProjectName ] = useState('');

  useEffect(() => {
     let [ urlPart, tagPart ] = selectedPackage?.url?.split('#') || [];
      setPackageUrl(urlPart);
      setPackageName(selectedPackage?.name);
      setReleaseTag(tagPart);
  }, [selectedPackage]);

  if (!active) {
    return null;
  }

  function callOnConfirm() {

    if (!(packageName.trim() && packageUrl.trim())) {
      // this should be a ui warning in the remote install window.
      console.error('invalid package name and/or url');
      return;
    }

    const validCharsRE = /^[a-zA-Z0-9-_]+$/;
    if (!(validCharsRE).test(packageName)) {
      console.error(' Project name can only contain alphanumeric, dash and underscores characters');
      return;
    }

    onConfirm(packageName, `${packageUrl}${releaseTag ? `#${releaseTag}` : ''}`);

  }

  function updatePackageName(e) {
    setPackageName(e.target.value)
  }

  function updatePackageUrl(e) {
    setPackageUrl(e.target.value)
  }

  function updateReleaseTag(e) {
    setReleaseTag(e.target.value);
  }

  function updateSelectedPackageType(e) {
    setPackageSpec('');
    setSelectedPackageType(e.target.value);
  }


  return (
    <div className="install-package-form">
      <Card className="no-border install-type">
        <div className="radio-group-container">
          {
            packageTypes.map((packageType, index) => (
              <label key={ packageType }>
                { packageType === 'npm' && <i className="install-package-icon fab fa-npm" /> }
                { packageType === 'github' && <i className="install-package-icon fab fa-github" /> }
                { packageType === 'url' && <i className="install-package-icon fas fa-link" /> }
                <input
                  className="install-package-type"
                  onChange={ updateSelectedPackageType }
                  checked={ packageType === selectedPackageType }
                  value={ packageTypes[index] }
                  type="radio"
                  name="package-type" />
              </label>
            ))
          }
        </div>
      </Card>
      <Card className="no-border install-fields">
        <input
          value={ projectName }
          placeholder="project name"
          onChange={ e => setProjectName(e.target.value) }/>
        {
          selectedPackageType === 'npm' && <NpmInstallWindow onConfirm={onConfirm} projectName={projectName} />
        }
        {
          selectedPackageType === 'github' && <GithubInstallWindow onConfirm={onConfirm} projectName={projectName}  />
        }
        {
          selectedPackageType === 'url' && <URLInstallWindow onConfirm={onConfirm} projectName={projectName} />
        }
      </Card>
    </div>
  );
}



export function NpmInstallWindow({ projectName, onConfirm }) {

  const [ packageQuery, setPackageQuery ] = useState('');
  const [ debouncedPackageQuery ] = useDebounce(packageQuery, 300);
  const [ distTags, setDistTags ] = useState('');
  const [ selectedDistTag, setSelectedDistTag ] = useState('');
  const [ matchingPackage, setMatchingPackage ] = useState(''); 

  function updatePackageQuery(e) {
    setPackageQuery(e.target.value);
  }

  function updateSelectedDistTag(e) {

    setSelectedDistTag(e.target.value);
  }

  useEffect(() => {

    async function findPackageName(query) {

      const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${query}`);
      const packages = await response.json();
      const pkg = packages.objects.find(p => p.package.name === query); 

      setMatchingPackage(pkg?.package?.name);

      return pkg?.package?.name;

    }

    async function getDistTags(packageName) {

      // searching for a non-existent package via https://registry.npmjs.org/<packageName> will throw a cors error
      // so instead, we search for repo using api /search endpoint, compare desired package name
      // against the returned results array. If one exactly matches, that package exists.
      // When the package exists, we can then look it up against the registry by its package name (avoiding cors error)
      // and grab the resulting 'dist-tags' property from the returned payload.

      if (packageName) {

        const packageResponse = await fetch(`https://registry.npmjs.org/${packageName}`);
        const packageResponseData = await packageResponse.json();

        return packageResponseData['dist-tags'];

      }

      return null;

    }

    if (debouncedPackageQuery) {

      findPackageName(debouncedPackageQuery).then(packageName => {
        getDistTags(packageName).then(tags => {
          setDistTags(tags);
          setSelectedDistTag(null);
        }).catch(e => {
          throw e;
        });
      })

    } else {
      setMatchingPackage(null);
      setDistTags(null);
      setSelectedDistTag(null);
    }

  }, [debouncedPackageQuery]);

  return (
    <div className="install-window install-npm">
      <input
        className="elegant-input"
        value={packageQuery}
        placeholder="[@scope]/package"
        onChange={ updatePackageQuery } />
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
      <button
        className="get-package-button"
        disabled={ !(matchingPackage && projectName) }
        onClick={
          () => {
            const npmPackageSpecifier = selectedDistTag ? `${matchingPackage}@${selectedDistTag}` : matchingPackage;
            onConfirm(projectName, npmPackageSpecifier);
          }
        }>Get Package</button>
    </div>
  );

}

export function GithubInstallWindow({ onConfirm, projectName }) {

  const [ user, setUser ] = useState('');
  const [ debouncedUser ] = useDebounce(user, 300);

  const [ repo, setRepo ] = useState('');
  const [ debouncedRepo ] = useDebounce(repo, 300);

  const [ tags, setTags ] = useState([]);

  const [ selectedTag, setSelectedTag ] = useState('');
  const [ targetRepo, setTargetRepo ] = useState('');

  // if we have a repo or a user/org + repo, fetch branches and release tags from api
  useEffect(() => {

    async function ensureRepoExists(user, repo) {

      try {

        const response = await fetch(`https://api.github.com/repos/${user}/${repo}`);
        const data = await response.json();

        return response.status < 400 ? data.name : false;

      } catch(e) {
        return false;
      }

    }

    async function getTags(user, repo) {

      try {

        const response = await fetch(`https://api.github.com/repos/${user}/${repo}/git/refs/tags`);
        
        if (response.status < 400) {
          const tagData = await response.json();
          return tagData.map(tag => tag.ref.split('/').slice(-1)[0]);
        }

        return null;


      } catch(e) {
        throw e;
      }

    }

    // if we have all the info needed to fetch a repo but don't have tags for that yet
    // TODO: ensure user and repo exist as well, before looking for tags.
    // if they don't exist, don't allow package fetch.

    if (debouncedUser && debouncedRepo && !tags) {

      ensureRepoExists(user, debouncedRepo).then((targetRepoName) => {

        if (targetRepoName) {

          setTargetRepo(targetRepoName);

          getTags(user, debouncedRepo).then(repoTags => {

            setTags(repoTags);

          })

        } else {

          setTargetRepo('');
          setTags(null);

        }

      });

    } else {
      setTags(null);
    }

  }, [debouncedUser, debouncedRepo]);


  return (
    <div className="install-window install-npm">
      <input placeholder="user" onChange={ (e) => setUser(e.target.value) } value={user} />
      <input placeholder="repo" onChange={ (e) => setRepo(e.target.value) } value={repo} />
      <label>
        <select
          disabled={!tags}
          className="github-tag-list"
          onChange={
            (e) => {
              setSelectedTag(e.target.value);
            }
          }>
          <option value=''>choose a tag</option>
          {
            tags?.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))
          }
        </select>
      </label>
      <button
        onClick={
          () => {
            // when we have a selected tag, use the semver notation.
            const targetRepoSpec = selectedTag ? `${user}/${repo}#semver:${selectedTag}` : `${user}/${repo}`;
            console.log('target repo spec: ', targetRepoSpec);
            onConfirm(projectName, targetRepoSpec)
          }
        }
        className="get-package-button"
        disabled={!(targetRepo && projectName)}>Get Package</button>
    </div>
  );

}

export function URLInstallWindow({ onConfirm, projectName }) {

  const [ packageUrl, setPackageUrl ] = useState('');

  return (
    <div className="install-window install-npm">
      <input
        value={ packageUrl }
        onChange={ (e) => setPackageUrl(e.target.value) }
        placeholder="url to gzipped tarball" />
      <button
        className="get-package-button"
        disabled={!(packageUrl && projectName)}
        onClick={ (e) => onConfirm(projectName, packageUrl) }>Get Package</button>
    </div>
  );

}

export default function EditorWindow({ children }) {
  return <Card className="editor-window">
  { children }
  </Card>
}
