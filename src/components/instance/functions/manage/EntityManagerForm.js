import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input } from 'reactstrap';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import instanceState from '../../../../functions/state/instanceState';

import buildCustomFunctions from '../../../../functions/instance/buildCustomFunctions';
import setCustomFunction from '../../../../functions/api/instance/setCustomFunction';

const generateFunctionTemplate = (entityName) => `'use strict';

// add your own dependencies and helper methods within your custom functions directory
const filter = require('../helpers/filter');
const authenticator = require('../helpers/authenticator');

module.exports = async (server, { hdbCore, logger }) => {
  // THIS IS A POST ROUTE WITH AN OPERATION IN THE REQUEST BODY
  // IT USES THE hdbCore.preValidation HOOK TO PROCESS BASIC OR TOKEN AUTH
  // IT USES THE hdbCore.request METHOD TO EXECUTE THE VALIDATED REQUEST
  server.route({
    url: '/${entityName}',
    method: 'POST',
    preValidation: hdbCore.preValidation,
    handler: hdbCore.request,
  })
  
  // THIS IS A GET ROUTE
  // IT USES A CUSTOM preValidation HOOK, "authenticator", TO AUTHORIZE THE REQUEST
  // IT USES THE hdbCore.requestWithoutAuthentication METHOD TO EXECUTE THE REQUEST
  // IT USES A CUSTOM FUNCTION, "filter", TO FORMAT THE RESPONSE
  server.route({
    url: '/${entityName}/:id',
    method: 'GET',
    preValidation: authenticator,
    handler: (request) => {
      // set your request body to any standard HarperDB operation
      request.body= {
        operation: 'sql',
        sql: \`SELECT * FROM dev.dogs WHERE id = \${request.params.id}\`
      };
      // await the result of the requestWithoutAuthentication call
      const result = await hdbCore.requestWithoutAuthentication(request);
      // return the filtered result
      return filter(result, ['dog_name', 'owner_name', 'breed']);
    }
  })
}

module.exports.autoPrefix = ''; // YOU CAN USE THIS PREFIX FOR VERSIONS, OR ROOT PATH
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
