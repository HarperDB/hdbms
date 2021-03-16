import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input } from 'reactstrap';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import instanceState from '../../../../functions/state/instanceState';

import buildCustomFunctions from '../../../../functions/instance/buildCustomFunctions';
import setCustomFunction from '../../../../functions/api/instance/setCustomFunction';

const generateFunctionTemplate = (entityName) => `'use strict'

async function ${entityName} (server, { hdbApiStream, hdbApiClient, hdbCore }) {
  server.route({
    url: '/${entityName}',
    method: 'GET',
    handler: async (request, response) => {
      // your code here
      // use an hdbCore method: hdbCore.searchByHash('dev', 'dog', [9], ['*'])
      // make a call to the hdbAPI: await hdbApiClient.request({})
      // return using the response object: response.send({ dog1, dog2 })
      response.send({ message: '/${entityName} endpoint has been created' });
    }
  })
}

module.exports = ${entityName};
module.exports.autoPrefix = ''
`;

const EntityManagerForm = ({ items, toggleDropItem, toggleCreate, baseUrl }) => {
  const history = useHistory();
  const alert = useAlert();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);

  const [entityName, setEntityName] = useState(false);
  const [nameError, toggleNameError] = useState(false);
  const [addingItem, setAddingItem] = useState(false);

  const createItem = async (e) => {
    e.preventDefault();
    let error = false;

    if (!entityName || items.includes(entityName)) {
      toggleNameError(true);
      error = true;
    }

    if (error) return false;

    setAddingItem(true);

    const function_content = generateFunctionTemplate(entityName);

    const result = await setCustomFunction({ auth, url, function_name: entityName, function_content });

    if (result.error) {
      setAddingItem(false);
      toggleCreate(false);
      return alert.error(result.message);
    }

    return buildCustomFunctions({ auth, url });
  };

  useEffect(() => toggleDropItem(), [toggleDropItem]);

  useEffect(() => {
    if (entityName && items.find((i) => i === entityName)) {
      history.push(`${baseUrl}/${entityName}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <Row className="item-row form">
      <Col className="input-holder">
        <Input
          id="name"
          invalid={nameError}
          onChange={(e) => {
            toggleNameError(false);
            setEntityName(e.target.value);
          }}
          value={entityName || ''}
          disabled={addingItem}
          type="text"
          name="name"
          placeholder="name"
        />
      </Col>
      <Col className="item-action">
        {addingItem ? (
          <Button color="success" className="round mr-1">
            <i className="fa fa-spinner fa-spin text-white" />
          </Button>
        ) : (
          <>
            <Button id="createItem" color="success" className="round mr-1" onClick={createItem} onKeyDown={(e) => e.keyCode !== 13 || createItem(e)}>
              <i className="fa fa-check text-white" />
            </Button>
            <Button id="toggleCreate" color="black" className="round" onClick={() => toggleCreate(false)}>
              <i className="fa fa-times text-white" />
            </Button>
          </>
        )}
      </Col>
    </Row>
  );
};

export default EntityManagerForm;
