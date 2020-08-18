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

export default () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const formHeight = '513px';
  const options = [
    { label: 'C', value: 'c' },
    { label: 'C++', value: 'c++' },
    { label: 'C#', value: 'csharp' },
    { label: 'Go', value: 'golang' },
    { label: 'JavaScript', value: 'js' },
    { label: 'Kotlin', value: 'kotlin' },
    { label: 'Python', value: 'python' },
    { label: 'PHP', value: 'php' },
    { label: 'Ruby', value: 'ruby' },
    { label: 'Rust', value: 'rust' },
    { label: 'Swift', value: 'swift' },
  ];

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { name, description, language, homepage, install_command, author_github_repo } = formData;

      if (!name || !description || !language || !homepage || !install_command) {
        setFormState({ error: 'All fields must be filled out' });
        setTimeout(() => setFormState({}), 2000);
      } else if (!isURL(homepage)) {
        setFormState({ error: 'homepage must be a valid URL' });
        setTimeout(() => setFormState({}), 2000);
      } else if (author_github_repo && !isURL(author_github_repo)) {
        setFormState({ error: 'github repo must be a valid URL' });
        setTimeout(() => setFormState({}), 2000);
      } else {
        setFormState({ processing: true });
        const response = await upsertIntegration({ auth, name, description, language, homepage, install_command });

        if (response.message.indexOf('successfully') !== -1) {
          getIntegrations({ auth });
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
        {' '}
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
                autoComplete="false"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <SelectDropdown
                className="react-select-container mb-2"
                classNamePrefix="react-select"
                onChange={({ value }) => setFormData({ ...formData, language: value })}
                options={options}
                value={options && formData.language && options.find((r) => r.value === formData.language)}
                isSearchable={false}
                isClearable={false}
                isLoading={!options}
                placeholder="select a language"
                styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
              />
              <Input
                type="text"
                className="mb-2 text-center"
                name="homepage"
                autoComplete="false"
                placeholder="public github repo url"
                value={formData.homepage || ''}
                onChange={(e) => setFormData({ ...formData, homepage: e.target.value })}
              />
              <Input
                type="text"
                className="mb-2 text-center"
                name="install_command"
                autoComplete="false"
                placeholder="install command"
                value={formData.install_command || ''}
                onChange={(e) => setFormData({ ...formData, install_command: e.target.value })}
              />
              <Input
                type="text"
                className="mb-2 text-center"
                name="description"
                autoComplete="false"
                placeholder="description: e.g. HarperDB for Malbolge"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {auth && !auth.github_repo && (
                <>
                  <Input
                    type="text"
                    className="mb-2 text-center"
                    name="author_github_repo"
                    autoComplete="false"
                    placeholder="your github profile url"
                    value={formData.author_github_repo || ''}
                    onChange={(e) => setFormData({ ...formData, author_github_repo: e.target.value })}
                  />
                </>
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
                autoComplete="false"
                placeholder="https://feedback.harperdb.io/suggestions/99152/react-sdk"
                value={formData.bounty_url || ''}
                onChange={(e) => setFormData({ ...formData, bounty_url: e.target.value })}
              />
              <Button color="purple" className="mt-3" block onClick={() => setFormState({ submitted: true })}>
                Submit for Review
              </Button>
            </CardBody>
          </Card>
        )}{' '}
      </ErrorBoundary>
    </>
  );
};
