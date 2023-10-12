export function isValidProjectName(name) {
  return /^[a-zA-Z0-9-_]+$/.test(name);
}

export async function ensureRepoExists(user, repo) {

  try {

    const response = await fetch(`https://api.github.com/repos/${user}/${repo}`);
    const data = await response.json();

    return response.status < 400 ? data.name : null;

  } catch(e) {
    return null;
  }

}

export async function getGithubTags(user, repo) {

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

export async function findNpmPackageName(query) {

  const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${query}`);
  const packages = await response.json();
  const pkg = packages.objects.find(p => p.package.name === query);

  return pkg?.package?.name;

}

export async function getNpmDistTags(packageName) {

  // searching for a non-existent package via https://registry.npmjs.org/<packageName> will throw a cors error
  // so instead, we search for repo using api /search endpoint, compare desired package name
  // against the returned results array. If one exactly matches, that package exists.
  // When the package exists, we can then look it up against the registry by its package name (avoiding cors error)
  // and grab the resulting 'dist-tags' property from the returned payload.

  const packageResponse = await fetch(`https://registry.npmjs.org/${packageName}`);
  const packageResponseData = await packageResponse.json();

  return packageResponseData['dist-tags'];

}
