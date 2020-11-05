import React from 'react';
import { CardBody, Card } from 'reactstrap';

export default ({ message, error = false, accessErrors }) => {
  const tableErrors = accessErrors && accessErrors.filter((t) => t.type === 'table');
  const attributeErrors = accessErrors && accessErrors.filter((t) => t.type === 'attribute');

  return (
    <>
      <div className="floating-card-header">&nbsp;</div>
      <Card className="my-3">
        <CardBody className="empty-prompt">
          <div className={`text-center ${error ? 'text-danger' : ''}`}>{message}</div>
          {error && (
            <div className="px-5">
              {tableErrors && tableErrors.length ? (
                <>
                  <hr className="my-4" />
                  <ul>
                    {tableErrors.map((e) => (
                      <li key={`${e.schema}${e.table}${e.entity}${e.permission}`} className="mb-2">
                        {e.schema} &gt; {e.type === 'attribute' && <span>{e.table} &gt;</span>} <b>{e.entity}</b>: {e.type} requires <b>{e.permission}</b> permissions
                      </li>
                    ))}
                  </ul>
                  <hr />
                </>
              ) : null}
              {attributeErrors && (
                <>
                  <hr className="my-4" />
                  <ul>
                    {attributeErrors.map((e) => (
                      <li key={`${e.schema}${e.table}${e.entity}${e.permission}`} className="mb-2">
                        {e.schema} &gt; {e.type === 'attribute' && <span>{e.table} &gt;</span>} <b>{e.entity}</b>: {e.type} requires <b>{e.permission}</b> permissions
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};
