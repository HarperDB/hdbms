import React, { useState, useEffect } from 'react';
import { Card } from 'reactstrap';
import NameInput from './NameInput';
import { useDebounce } from 'use-debounce';

async function getGithubTags(user, repo) {

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

function parsePackageType(pkg) {

  if (!pkg) {
    return null;
  }

  let meta = {
    type: null,
    user: null,
    repo: null,
    url: null,
    package: null,
    tag: null
  };

  if (pkg.url.match('://')) {

    // it's a url
    meta.url = pkg.url;
    meta.type = 'url';

  } else if (pkg.url.match('semver:')) {
    // it's a github repo
    const [ user, repo, semverTag ] = pkg.url.split(/[/#]/);  
    meta.type = 'github';
    meta.user = user;
    meta.repo = repo;
    meta.tag = semverTag;
  } else {

    meta.type = 'npm';
    const parts = pkg.url.split('/');

    // TODO: what should this format be?
    // what does the form need?

    if (parts.length === 1) {
    // no scope, e.g harperdb[@2], not @harperdb/harperdb[@2] 

      const [ p, tag ] = parts.split('@');

      meta.package = p;
      meta.tag = tag;

    } else if (parts.length == 2) {
    // has @scope, e.g @harperdb/harperdb[@2]

      const [ scope, pkgAndTag ] = parts; 
      const [ p, tag ] = pkgAndTag.split('@');

      meta.package = p;
      meta.tag = tag;

    }

  }
       
    // it's an npm package
    return meta;
}

export function InstallPackageWindow({ active, selectedPackage, onConfirm, onCancel, onPackageChange }) {


  // manages:
  // - which install form to use.
  // - project name.
  // - calls confirm, as parent of individual install type form.

  const parsedPackageType = parsePackageType(selectedPackage);
  const packageTypes = [ 'npm', 'github', 'url' ];
  const [ selectedPackageType, setSelectedPackageType ] = useState(parsedPackageType?.type || packageTypes[0]);
  const [ projectName, setProjectName ] = useState(selectedPackage?.name || '');
  const [ projectNameError, setProjectNameError ] = useState(null);

  const reinstallable = Boolean(selectedPackage);

  if (!active) {
    return null;
  }


  function isValidProjectName(name) {
    return /^[a-zA-Z0-9-_]+$/.test(name); 
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
                  disabled={ selectedPackage && parsedPackageType.type !== packageType }
                  className="install-package-type"
                  onChange={ updateSelectedPackageType }
                  checked={ packageType === selectedPackageType || packageType === parsedPackageType?.type }
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
          onChange={
            (e) => {
              if (isValidProjectName(e.target.value)) {
                setProjectName(e.target.value); 
              } else {
                setProjectNameError(e.target.value);
              }
            }
          }/>
        {
          selectedPackageType === 'npm' &&
          <NpmInstallWindow
            onConfirm={ onConfirm }
            projectName={ projectName }
            reinstall={ reinstallable }
            pkg={ parsedPackageType } />
        }
        {
          selectedPackageType === 'github' &&
          <GithubInstallWindow
            onConfirm={ onConfirm }
            projectName={ projectName }
            reinstall={ reinstallable }
            pkg={ parsedPackageType } />
        }
        {
          selectedPackageType === 'url' &&
          <URLInstallWindow
            onConfirm={onConfirm}
            projectName={projectName}
            reinstall={reinstallable}
            pkg={ parsedPackageType } />
        }
      </Card>
    </div>
  );
}

export function NpmInstallWindow({ projectName, reinstallable, onConfirm }) {

  const [ packageQuery, setPackageQuery ] = useState('');
  const [ debouncedPackageQuery ] = useDebounce(packageQuery, 300);
  const [ distTags, setDistTags ] = useState('');
  const [ selectedDistTag, setSelectedDistTag ] = useState('');
  const [ matchingPackage, setMatchingPackage ] = useState(''); 
  const buttonLanguage = reinstallable ? 'Reinstall Package' : 'Get Package';

  function updatePackageQuery(e) {
    setPackageQuery(e.target.value);
  }

  function updateSelectedDistTag(e) {

    setSelectedDistTag(e.target.value);
  }

  useEffect(() => {

    if (debouncedPackageQuery) {

      findNpmPackageName(debouncedPackageQuery).then(packageName => {

        setMatchingPackage(packageName);

        if (packageName) {

          getNpmDistTags(packageName).then(tags => {
            setDistTags(tags);
            setSelectedDistTag(null);
          }).catch(e => {
            throw e;
          });

        }

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
            // note: i am not currently differentiating between '@org/pkg' and 'pkg' here.
            const npmPackageSpecifier = selectedDistTag ? `${matchingPackage}@${selectedDistTag}` : matchingPackage;
            onConfirm(projectName, npmPackageSpecifier);
          }
        }>{ buttonLanguage }</button>
    </div>
  );

}

export function GithubInstallWindow({ onConfirm, reinstallable, projectName, pkg }) {

  const [ user, setUser ] = useState('');
  const [ debouncedUser ] = useDebounce(user, 300);

  const [ repo, setRepo ] = useState('');
  const [ debouncedRepo ] = useDebounce(repo, 300);

  const [ tags, setTags ] = useState([]);

  const [ selectedTag, setSelectedTag ] = useState('');
  const [ targetRepo, setTargetRepo ] = useState('');

  const buttonLanguage = reinstallable ? 'Reinstall Package' : 'Get Package';

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

    // if we have all the info needed to fetch a repo but don't have tags for that yet
    // TODO: ensure user and repo exist as well, before looking for tags.
    // if they don't exist, don't allow package fetch.

    if (debouncedUser && debouncedRepo && !tags) {

      ensureRepoExists(user, debouncedRepo).then((targetRepoName) => {

        if (targetRepoName) {

          setTargetRepo(targetRepoName);

          getGithubTags(user, debouncedRepo).then(repoTags => {

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
            onConfirm(projectName, targetRepoSpec)
          }
        }
        className="get-package-button"
        disabled={!(targetRepo && projectName)}>{ buttonLanguage }</button>
    </div>
  );

}

export function URLInstallWindow({ onConfirm, reinstallable, projectName }) {

  const [ packageUrl, setPackageUrl ] = useState('');

  const buttonLanguage = reinstallable ? 'Reinstall Package' : 'Get Package';

  return (
    <div className="install-window install-npm">
      <input
        value={ packageUrl }
        onChange={ (e) => setPackageUrl(e.target.value) }
        placeholder="url to gzipped tarball" />
      <button
        className="get-package-button"
        disabled={!(packageUrl && projectName)}
        onClick={ (e) => onConfirm(projectName, packageUrl) }>{ buttonLanguage }</button>
    </div>
  );

}

export default function EditorWindow({ children }) {
  return <Card className="editor-window">
  { children }
  </Card>
}

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
