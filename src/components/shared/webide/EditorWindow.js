import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { Card } from 'reactstrap';
import NameInput from './NameInput';
import { useDebounce } from 'use-debounce';

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
    meta.tag = semverTag.replace('semver:','');
  } else {

    meta.type = 'npm';
    const parts = pkg.url.split('/');

    // TODO: what should this format be?
    // what does the form need?

    if (parts.length === 1) {
    // no scope, e.g harperdb[@2], not @harperdb/harperdb[@2]

      const [ p, tag ] = parts[0].split('@');

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

  return meta;

}

export function PackageInstallWindow({ selectedPackage, onConfirm, onCancel, onPackageChange, deployTargets: availableDeployTargets }) {

  // manages:
  // - which install form to use.
  // - theh package's project name
  // - calls onConfirm callback

  /*
   * existing package? selectedPackage
   * parse it for the info.
   *
   * diff between selectedPackage and parsedPackageType?
   * selectedPackageType => parsedPackageType and that's used for rest.
   */

  const packageTypes = [ 'npm', 'github', 'url' ];
  const [ installed, setInstalled ] = useState(Boolean(selectedPackage));

  const [ packageInfo, setPackageInfo ] = useState(parsePackageType(selectedPackage));
  const [ packageType, setPackageType ] = useState(packageInfo?.type || packageTypes[0]);

  const [ projectName, setProjectName ] = useState(selectedPackage?.name || '');
  const [ projectNameIsValid, setProjectNameIsValid ] = useState(true);

  const [ deployTargets, setDeployTargets ] = useState([availableDeployTargets.find(t => t.isCurrentInstance)]);

  useEffect(() => {

    const newPackageInfo = parsePackageType(selectedPackage); 

    setProjectName(selectedPackage?.name || '');
    setPackageInfo(parsePackageType(selectedPackage));
    setPackageType(newPackageInfo?.type || packageTypes[0]);
    setInstalled(Boolean(selectedPackage));

  }, [selectedPackage]);

  function updateSelectedPackageType(e) {
    setPackageType(e.target.value);
  }

  function validateProjectName() {
    setProjectNameIsValid(isValidProjectName(projectName));
  }

  useEffect(validateProjectName, [ projectName ]);

  return (
    <div className="install-package-form">
      <Card className="package-type">
          {
            packageTypes.map((pkgType, index) => (
              <label key={ pkgType }>
                { pkgType === 'npm' && <i className="install-package-icon fab fa-npm" /> }
                { pkgType === 'github' && <i className="install-package-icon fab fa-github" /> }
                { pkgType === 'url' && <i className="install-package-icon fas fa-link" /> }
                <input
                  title={pkgType + ' package'}
                  disabled={
                    /* when we have an existing selected package, the selection is pre-defined */
                    selectedPackage && packageInfo?.type !== pkgType
                  }
                  onChange={ updateSelectedPackageType }
                  checked={ pkgType === packageType }
                  value={ packageTypes[index] }
                  type="radio"
                  name="package-option" />
              </label>
            ))
          }
      </Card>
      <Card className="install-fields">
        <label className="project-name-field">
          Project Name:
          <input
            className={
              cn("project-name-input", {
                invalid: !projectNameIsValid && projectName.length > 0
              })
            }
            title="enter a name for this package"
            value={ projectName }
            placeholder="project name"
            onChange={
              (e) => {
                setProjectName(e.target.value);
                setProjectNameIsValid(isValidProjectName(e.target.value));
              }
            }/>
          {
            (!projectNameIsValid && projectName.length > 0) && 
            <i title="your project name must only contain alphanumerics, dashes or underscores."
               className="project-name-invalid fa fa-warning" /> 
          }
        </label>
        <label>Deploy Targets: 
          <select
            multiple={true}
            onChange={
              (e) => {

                const selectedHostUrls = [...e.target.selectedOptions].map(o => o.value);
                const updatedDeployTargets = availableDeployTargets.filter(t => selectedHostUrls.includes(t.instance.url));

                setDeployTargets(updatedDeployTargets);

              }
            }
            defaultValue={[ deployTargets[0].instance.url ]}>
            {
              availableDeployTargets.map(t => {
                const label = t.isCurrentInstance ? `${t.instance.host} (this instance)` : t.instance.host;
                return (
                  <option key={ t.instance.url } value={t.instance.url}>{ label }</option>
                )
              })
            }
          </select>
        </label>
        {
          packageType === 'npm' &&
          <NpmInstallWindow
            onConfirm={ onConfirm }
            projectName={ projectName }
            installed={ installed }
            pkg={ packageInfo } 
            deployTargets={ deployTargets } />
        }
        {
          packageType === 'github' &&
          <GithubInstallWindow
            onConfirm={ onConfirm }
            projectName={ projectName }
            installed={ installed }
            pkg={ packageInfo }
            deployTargets={ deployTargets } />
        }
        {
          packageType === 'url' &&
          <UrlInstallWindow
            onConfirm={onConfirm}
            projectName={projectName}
            installed={installed}
            pkg={ packageInfo }
            deployTargets={ deployTargets } />
        }
      </Card>
    </div>
  );
}

export function GithubInstallWindow({ onConfirm, installed, projectName, pkg, deployTargets }) {

  const [ user, setUser ] = useState(pkg?.user || '');
  const [ debouncedUser ] = useDebounce(user, 300);

  const [ repo, setRepo ] = useState(pkg?.repo || '');
  const [ debouncedRepo ] = useDebounce(repo, 300);

  const [ tags, setTags ] = useState([]);
  const [ tagsFetched, setTagsFetched ] = useState(false);

  const [ selectedTag, setSelectedTag ] = useState(pkg?.tag || '');
  const [ targetRepo, setTargetRepo ] = useState('');

  const [ loading, setLoading ] = useState(false);
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

      setLoading(true);
      ensureRepoExists(user, debouncedRepo).then((targetRepoName) => {

        if (targetRepoName) {

          setTargetRepo(targetRepoName);
          setFound(true);

          getGithubTags(user, debouncedRepo).then(repoTags => {

            setLoading(false);
            setTagsFetched(true);
            setTags(repoTags);

          })

        } else {

          setLoading(false);
          setFound(false);
          setTargetRepo('');
          setTags([]);

        }

      }).catch(e => {
        setLoading(false);
      });

    } else {

      setFound(false);
      setLoading(false);

      setTags([]);
      setSelectedTag('');
    }

  }, [debouncedUser, debouncedRepo]);


  return (
    <div className="install-window github-install">
      <input
        title="github username"
        placeholder="user"
        onChange={ (e) => setUser(e.target.value) }
        value={user} />
      <div className="github-package-search-box">
        <input
          title="github repo name"
          placeholder="repo"
          onChange={ (e) => setRepo(e.target.value) }
          value={repo} />
        <span className="search-status-icon-container github-repo-query">
          <i className={
            cn("search-status-icon fas", { 
              "fa-spinner fa-spin loading": loading, 
              "fa-check found": debouncedUser.length > 0 && debouncedRepo.length > 0 && found,
              "fa-times not-found": debouncedRepo.length > 0 && debouncedUser.length > 0 && !(loading || found), 
              "fa-check not-searching": debouncedUser.length === 0 || debouncedRepo.length === 0
            })
          } />
        </span>
      </div>
      <label>
        <select
          title="list of available github tags"
          value={selectedTag}
          disabled={tags.length === 0}
          className="github-tag-list"
          onChange={
            (e) => {
              setSelectedTag(e.target.value);
            }
          }>
          <option value=''>{tags.length > 0 ? 'choose a tag' : 'no tags available'}</option>
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
            // NOTE: using semver notation for github repo package specifiers.
            const targetRepoSpec = selectedTag ? `${user}/${repo}#semver:${selectedTag}` : `${user}/${repo}`;
            onConfirm(projectName, targetRepoSpec, deployTargets);
          }
        }
        className="get-package-button"
        disabled={!(targetRepo && projectName && isValidProjectName(projectName))}>{ getPackageButtonLanguage }</button>
    </div>
  );

}
export function NpmInstallWindow({ projectName, installed, onConfirm, pkg, deployTargets }) {

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
  const [ loading, setLoading ] = useState(false);
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

  function updatePackageAndTags() {


    if (debouncedPackageQuery) {

      setLoading(true);
      findNpmPackageName(debouncedPackageQuery).then(packageName => {

        setLoading(false);
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
        setLoading(false);
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
                "fa-spinner fa-spin loading": loading, 
                "fa-check found": debouncedPackageQuery.length > 0 && found,
                "fa-times not-found": debouncedPackageQuery.length > 0 && !(loading || found), 
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
    </div>
  );

}

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
      <button
        className="get-package-button"
        disabled={!(packageUrl && projectName && isValidProjectName(projectName) )}
        onClick={ (e) => onConfirm(projectName, packageUrl, deployTargets) }>{ getPackageButtonLanguage }</button>
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

function isValidProjectName(name) {
  return /^[a-zA-Z0-9-_]+$/.test(name);
}

async function ensureRepoExists(user, repo) {

  try {

    const response = await fetch(`https://api.github.com/repos/${user}/${repo}`);
    const data = await response.json();

    return response.status < 400 ? data.name : null;

  } catch(e) {
    return null;
  }

}


async function getGithubTags(user, repo) {

  try {

    const response = await fetch(`https://api.github.com/repos/${user}/${repo}/git/refs/tags`);

    if (response.status < 400) {
      const tagData = await response.json();
      return tagData.map(tag => tag.ref.split('/').slice(-1)[0]);
    }

    return [];


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
