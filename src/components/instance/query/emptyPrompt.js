import React from 'react';
import { CardBody, Card } from '@nio/ui-kit';

export default ({ message, error = false, accessErrors }) => (
  <>
    <div className="floating-card-header">&nbsp;</div>
    <Card className="my-3 py-5">
      <CardBody>
        <div className={`text-center ${error ? 'text-danger' : ''}`}>
          {message}
          {accessErrors && (
            <>
              <hr />
              {accessErrors.map((e) => (
                <div key={`${e.schema}${e.table}${e.attribute}${e.permission}`} className="mb-2">
                  {e.schema} &gt; {e.table} &gt; {e.attribute} &gt; requires {e.permission} permissions
                </div>
              ))}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  </>
);
