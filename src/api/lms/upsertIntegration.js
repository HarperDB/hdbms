import queryLMS from '../queryLMS';

export default async ({ auth, name, description, language, homepage, install_command, author_github_repo }) =>
  queryLMS({
    endpoint: 'upsertIntegration',
    method: 'POST',
    payload: { author_user_id: auth.user_id, name, description, language, homepage, install_command, author_github_repo, category: 'SDK' },
    auth,
  });
