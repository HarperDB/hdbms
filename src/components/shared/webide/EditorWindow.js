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

export function DeployComponentWindowGithub() {
  return <div>github</div>
}

export function DeployComponentWindowNpm() {
  return <div>npm</div>
}

export function DeployComponentWindowURL() {
  return <div>url</div>
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

/*
      {
        reinstallable ?
          <label className="instructions">Reinstall {package?.name} from npm or an external URL:</label> :
          <label className="instructions">Install a package component from an external URL:</label>
      }

      <label>
        <span>Package name</span>:
        <input
          autoFocus
          value={ packageName }
          onChange={ updatePackageName }
          placeholder="name your external component" />
      </label>
      <label>
        <span>External Package URL</span>:
        <input
          value={ packageUrl }
          onChange={ updatePackageUrl }
          placeholder="url to external component" />
      </label>
      <label>
        <span>Tag</span>:
        <input
          value={ releaseTag }
          onChange={ updateReleaseTag }
          placeholder="enter a tag if one exists (e.g. '0.0.1')" />
      </label>
      <button
        onClick={ callOnConfirm }
        disabled={ !(packageName && packageUrl) }>{reinstallable ? 'Re-Install' : 'Install' } External Package</button>
      <button onClick={ onCancel }>Cancel</button>
    </div>

  */

export function NpmInstallWindow({ selectedPackage, onConfirm }) {

  const [ packageName, setPackageName ] = useState('');
  const [ debouncedPackageName ] = useDebounce(packageName, 300);
  const [ distTags, setDistTags ] = useState('');
  const [ selectedDistTag, setSelectedDistTag ] = useState('');

  function updatePackageName(e) {
    setPackageName(e.target.value);
  }

  function updateSelectedDistTag(e) {

    setSelectedDistTag(e.target.value);
  }

  useEffect(() => {

    async function getDistTags() {

      try {
        // NOTE: i get a cors error for 404 registry calls, i.e. if the packageName doesnt exist
        // so below, I am swallowing error in the catch block below.
        const response = await fetch(`https://registry.npmjs.org/${packageName}`);

        if (response.status === 404) {
          return null;
        }

        const data = await response.json();

        return data['dist-tags'];
      } catch(e) {
        console.log(e);
      }

    }

    if (debouncedPackageName) {

      getDistTags().then(tags => {
        setDistTags(tags);
        setSelectedDistTag(null);
      }).catch(e => {
        throw e;
      });

    } else {
      setDistTags(null);
      setSelectedDistTag(null);
    }

  }, [debouncedPackageName]);

  return (
    <div className="install-window install-npm">
      <input
        className="elegant-input"
        value={packageName}
        placeholder="[@scope]/package"
        onChange={ updatePackageName } />
      <select
        onChange={ updateSelectedDistTag }
        className="npm-dist-tag-list"
        disabled={!distTags}>
        <option value='' >
          choose a tag
        </option>
        {
          Object.entries(distTags || []).map(([tagName,tagValue]) => (
            <option
            value={tagName}>{`${tagName} (${tagValue})`}</option>
          ))

        }
      </select>
      <div>
        <button disabled={ !debouncedPackageName } onClick={
          () => {
            const url = selectedDistTag ? `${packageName}@${selectedDistTag}` : packageName;
            onConfirm(url);
          }
        }>Get Package</button>
      </div>
    </div>
  );

}

export function GithubInstallWindow({ selectedPackage, onConfirm }) {

  // TODO: use semver notation when fetching

  const [ user, setUser ] = useState('');
  const [ debouncedUser ] = useDebounce(user, 300);
  const [ repo, setRepo ] = useState('');
  const [ debouncedRepo ] = useDebounce(repo, 300);
  const [ tags, setTags ] = useState([]);
  const [ selectedTag, setSelectedTag ] = useState('');

  // if we have a repo or a user/org + repo, fetch branches and release tags from api
  useEffect(() => {

    async function getTags() {

      try {
        const response = await fetch(`https://api.github.com/repos/${user}/${debouncedRepo}/git/refs/tags`);

        if (response.status === 404) {
          return null;
        }

        const tagData = await response.json();
        return tagData.map(tag => tag.ref.split('/').slice(-1)[0]);
      } catch(e) {
        throw e;
      }

    }

    // if we have all the info needed to fetch a repo but don't have tags for that yet
    if (debouncedUser && debouncedRepo && !tags) {

      getTags().then(repoTags => {
        setTags(repoTags);
      }).catch(e => {
        console.error('e:', e);
        throw e;
      });

    } else {
      setTags(null);
    }

  }, [debouncedUser, debouncedRepo]);


  return (
    <div className="install-window install-npm">
      <input placeholder="user" onChange={ (e) => setUser(e.target.value) } value={user}/>
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
            const url = selectedTag ? `${user}/${repo}#semver:${selectedTag}` : `${user}/${repo}`;
            onConfirm(url)
          }
        }
        disabled={!(user && repo)}>Get Package</button>
    </div>
  );

}

export function URLInstallWindow() {

  return (
    <div className="install-window install-npm">
      <input placeholder="url to gzipped tarball" />
    </div>
  );

}


export function InstallPackageWindow({ active, selectedPackage, reinstallable, onConfirm, onCancel, onPackageChange }) {

  // TODO: link to npm install docs for user ref. https://docs.npmjs.com/cli/v10/commands/npm-install
  const packageTypes = ['npm', 'github', 'url' ];
  const [ url, tag ] = selectedPackage?.url?.split('#') || [];
  const [ packageName, setPackageName ] = useState(selectedPackage?.name || '');
  const [ packageUrl, setPackageUrl ] = useState(url || '');
  const [ releaseTag, setReleaseTag ] = useState(tag || '');
  const [ selectedPackageType, setSelectedPackageType ] = useState(packageTypes[0]);
  const [ packageSpec, setPackageSpec ] = useState('');

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
        {
          selectedPackageType === 'npm' && <NpmInstallWindow onConfirm={console.log} />
        }
        {
          selectedPackageType === 'github' && <GithubInstallWindow onConfirm={console.log} />
        }
        {
          selectedPackageType === 'url' && <URLInstallWindow onConfirm={console.log} />
        }
      </Card>
    </div>
  );
}

export default function EditorWindow({ children }) {
  return <Card className="editor-window">
  { children }
  </Card>
}
