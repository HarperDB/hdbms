import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input } from 'reactstrap';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import instanceState from '../../../../functions/state/instanceState';

import buildCustomFunctions from '../../../../functions/instance/buildCustomFunctions';
import setCustomFunction from '../../../../functions/api/instance/setCustomFunction';
import generateFunctionTemplate from '../../../../functions/instance/generateFunctionTemplate';
import addCustomFunctionProject from '../../../../functions/api/instance/addCustomFunctionProject';
import restartInstance from '../../../../functions/api/instance/restartInstance';

const EntityManagerForm = ({ items, toggleDropItem, toggleCreate, baseUrl, restarting, itemType, project }) => {
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

    let result;

    if (itemType === 'projects') {
      result = await addCustomFunctionProject({
        auth,
        url,
        project: entityName,
      });
    } else {
      const function_content = generateFunctionTemplate(itemType);

      result = await setCustomFunction({
        auth,
        url,
        project,
        type: itemType,
        file: entityName,
        function_content,
      });
    }

    if (result.error) {
      setAddingItem(false);
      toggleCreate(false);
      return alert.error(result.message);
    }

    restartInstance({ auth, url, service: 'custom_functions' });
    await buildCustomFunctions({ auth, url });
    return history.push(`${baseUrl}/${entityName}`);
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
          <Button color="success" className="round me-1">
            <i className="fa fa-spinner fa-spin text-white" />
          </Button>
        ) : (
          <>
            <Button id="createItem" color="success" className="round me-1" disabled={restarting} onClick={createItem} onKeyDown={(e) => e.keyCode !== 13 || createItem(e)}>
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
