import React, { useState } from 'react';
import { Input, Button, Card, CardBody } from 'reactstrap';
import SelectDropdown from 'react-select';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../state/appState';
import upsertIntegration from '../../../api/lms/upsertIntegration';
import FormStatus from '../../shared/formStatus';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';
import isURL from '../../../methods/util/isURL';
import getIntegrations from '../../../api/lms/getIntegrations';
import integrationLanguageOptions from '../../../methods/support/integrationLanguageOptions';
import getUser from '../../../api/lms/getUser';

export default () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const formHeight = auth.github_repo ? '405px' : '451px';

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { name, description, language, homepage, install_command, author_github_repo, bounty_url } = formData;
      if (!name || !description || !language || !homepage || !install_command || (!auth.github_repo && !author_github_repo)) {
        setFormState({ error: 'All fields must be filled out' });
        setTimeout(() => setFormState({}), 2000);
      } else if (!isURL(homepage)) {
        setFormState({ error: 'Project GitHub repo must be a valid URL' });
        setTimeout(() => setFormState({}), 2000);
      } else if (!isURL(bounty_url)) {
        setFormState({ error: 'Bounty URL must be a valid URL' });
        setTimeout(() => setFormState({}), 2000);
      } else if (author_github_repo && !isURL(author_github_repo)) {
        setFormState({ error: 'Your GitHub profile must be a valid URL' });
        setTimeout(() => setFormState({}), 2000);
      } else {
        setFormState({ processing: true });
        const response = await upsertIntegration({ auth, name, description, language, homepage, install_command, author_github_repo, bounty_url });
        if (response.message.indexOf('successfully') !== -1) {
          getIntegrations({ auth });
          getUser(auth);
          setFormState({ success: response.message });
          setTimeout(() => setFormData({}), 2000);
        } else {
          setFormState({ error: response.message });
          setTimeout(() => setFormState({}), 2000);
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({}), [formData]);

  return (
    <>
      <div className="floating-card-header">Submit An Integration</div>
      <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallback}>
        {formState.processing ? (
          <FormStatus className="my-3" height={formHeight} status="processing" header="Submitting Integration" subhead="The Integration Irish Setter Is On The Case" />
        ) : formState.success ? (
          <FormStatus className="my-3" height={formHeight} status="success" header="Success!" subhead={formState.success} />
        ) : formState.error ? (
          <FormStatus className="my-3" height={formHeight} status="error" header={formState.error} subhead="Please try again" />
        ) : (
          <Card className="my-3">
            <CardBody>
              <Input
                type="text"
                className="mb-2 text-center"
                name="name"
                placeholder="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <SelectDropdown
                className="react-select-container mb-2"
                classNamePrefix="react-select"
                onChange={({ value }) => setFormData({ ...formData, language: value })}
                options={integrationLanguageOptions}
                value={integrationLanguageOptions && formData.language && integrationLanguageOptions.find((r) => r.value === formData.language)}
                isSearchable={false}
                isClearable={false}
                isLoading={!integrationLanguageOptions}
                placeholder="select a language"
                styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
              />
              <Input
                type="text"
                className="mb-2 text-center"
                name="install_command"
                placeholder="install command"
                value={formData.install_command || ''}
                onChange={(e) => setFormData({ ...formData, install_command: e.target.value })}
              />
              <Input
                type="text"
                className="mb-2 text-center"
                name="description"
                placeholder="description: e.g. HarperDB for Malbolge"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                type="text"
                className="mb-2 text-center"
                name="homepage"
                placeholder="project's public github repo"
                value={formData.homepage || ''}
                onChange={(e) => setFormData({ ...formData, homepage: e.target.value })}
              />
              {auth && !auth.github_repo && (
                <Input
                  type="text"
                  className="mb-2 text-center"
                  name="author_github_repo"
                  placeholder="your github profile url"
                  value={formData.author_github_repo || ''}
                  onChange={(e) => setFormData({ ...formData, author_github_repo: e.target.value })}
                />
              )}
              <span className="text-small d-block my-3">
                Claiming a{' '}
                <a href="https://feedback.harperdb.io/" target="_blank" rel="noopener noreferrer">
                  bounty
                </a>
                ? Provide the bounty URL:
              </span>
              <Input
                type="text"
                className="mb-2 text-center"
                name="bounty_url"
                placeholder="https://feedback.harperdb.io/suggestions/99152/react-sdk"
                value={formData.bounty_url || ''}
                onChange={(e) => setFormData({ ...formData, bounty_url: e.target.value })}
              />
              <Button color="purple" className="mt-3" block onClick={() => setFormState({ submitted: true })}>
                Submit for Review
              </Button>
            </CardBody>
          </Card>
        )}
      </ErrorBoundary>
    </>
  );
};
