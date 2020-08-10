import React, { useEffect, useState } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import SelectDropdown from 'react-select';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../state/appState';
import instanceState from '../../../state/instanceState';
import useCodeExampleLanguage from '../../../state/codeExampleLanguage';

import languages from '../../../methods/examples/languages';
import getMethodObject from '../../../methods/examples/getMethodObject';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';
import Code from '../../shared/code';

export default ({ showCustomMessage }) => {
  const { customer_id, compute_stack_id, folder, method } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const instance_name = useStoreState(instanceState, (s) => s.instance_name);
  const postmanCollection = useStoreState(appState, (s) => s.postmanCollection);
  const [methodObject, setMethodObject] = useState(false);
  const [language, setLanguage] = useCodeExampleLanguage(false);
  const [codeText, setCodeText] = useState(false);

  useEffect(() => {
    if (postmanCollection && folder && method) {
      const newMethodObject = getMethodObject(postmanCollection, folder, method);
      setMethodObject(newMethodObject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postmanCollection, method]);

  useEffect(() => {
    if (!language) {
      setLanguage(languages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    if (methodObject && language) {
      const thisLanguage = languages.find((l) => l.lang === language.lang && l.variant === language.variant);
      if (thisLanguage.snippet) {
        const yourAuthHeader = auth ? btoa(`${auth.user}:${auth.pass}`) : 'YOUR-AUTH-HEADER';
        const yourInstanceURL = url || 'YOUR-INSTANCE-URL';
        const newCodeText = thisLanguage.snippet({ url: yourInstanceURL, auth: yourAuthHeader, body: methodObject.request.body.raw });
        setCodeText(newCodeText);
      } else {
        setCodeText('You do not yet have a valid snippet generator for this language.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methodObject, language]);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <div className="floating-card-header">
        {instance_name} instance &gt; {folder?.toLowerCase()} {method && `> ${method.toLowerCase()}`}
      </div>
      <Card className="my-3">
        <CardBody>
          {showCustomMessage && (
            <>
              <b className="d-block text-danger text-center">
                <span className="custom-example-prompt">For examples pre-populated with the URL and Auth Header,</span>{' '}
                <span className="custom-example-prompt">choose an Organization, select an Instance, and click &quot;Example Code&quot;</span>
              </b>
              <hr />
            </>
          )}
          <Row>
            <Col xl="6" xs="12">
              <Row>
                <Col xl="6" xs="12" className="text-nowrap py-2 text-bold">
                  Choose Programming Language
                </Col>
                <Col xl="6" xs="12">
                  <SelectDropdown
                    className="react-select-container"
                    classNamePrefix="react-select"
                    onChange={({ value }) => setLanguage(value)}
                    options={languages && languages.map((l) => ({ label: `${l.lang} - ${l.variant}`, value: l }))}
                    value={{ label: language ? `${language.lang || ''} - ${language.variant}` : '', value: language }}
                    isSearchable={false}
                    isClearable={false}
                    isLoading={!languages}
                  />
                </Col>
              </Row>
              {methodObject?.request?.description && (
                <>
                  <hr />
                  <div className="mb-3" dangerouslySetInnerHTML={{ __html: methodObject?.request?.description }} />
                </>
              )}
            </Col>
            <Col xl="6" xs="12">
              {codeText && language ? (
                <Code>{codeText}</Code>
              ) : (
                <div className="py-5 text-center">
                  <i className="fa fa-spinner fa-spin text-purple" />
                </div>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </ErrorBoundary>
  );
};
