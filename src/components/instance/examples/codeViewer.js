import React, { useEffect, useState } from 'react';
import { Card, CardBody, SelectDropdown, Row, Col } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import appState from '../../../state/appState';
import instanceState from '../../../state/instanceState';
import useCodeExampleLanguage from '../../../state/codeExampleLanguage';

import languages from '../../../methods/examples/languages';
import getMethodObject from '../../../methods/examples/getMethodObject';

export default ({ showCustomMessage }) => {
  const { folder, method } = useParams();
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
  }, [postmanCollection, method]);

  useEffect(() => {
    if (!language) {
      setLanguage(languages[0]);
    }
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
  }, [methodObject, language]);

  return (
    <>
      <div className="floating-card-header">
        {instance_name} instance &gt; {folder?.toLowerCase()} {method && `> ${method.toLowerCase()}`}
      </div>
      <Card className="my-3">
        <CardBody>
          {showCustomMessage && (
            <>
              <b className="d-block text-danger text-center">
                For examples pre-populated with the URL and Auth Header, choose an Organization, select an Instance, and click &quot;Example Code&quot;
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
                  <div dangerouslySetInnerHTML={{ __html: methodObject?.request?.description }} />
                </>
              )}
            </Col>
            <Col xl="6" xs="12">
              {codeText && language ? (
                <SyntaxHighlighter language={language.syntax_mode} style={atomDark}>
                  {codeText}
                </SyntaxHighlighter>
              ) : (
                <div className="py-5 text-center">
                  <i className="fa fa-spinner fa-spin text-purple" />
                </div>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};
