import React from 'react';
import { Row, Col } from 'reactstrap';

import isObject from '../../../functions/util/isObject';

function LogsRow({ onRowClick, level, timestamp, message, tags, thread }) {
	return (
		<Row className="item-row" onClick={onRowClick}>
			<Col className={`text-nowrap ${level?.toLowerCase()}`}>{level?.toUpperCase() || 'UNKNOWN'}</Col>
			<Col className="text-nowrap">{new Date(timestamp || null).toLocaleDateString()}</Col>
			<Col className="text-nowrap">{new Date(timestamp || null).toLocaleTimeString()}</Col>
			<Col className="text-nowrap">{thread}</Col>
			<Col className="text-nowrap">{tags?.join(', ')}</Col>
			{
				// TODO: Create a "more info" button to show the full log details with the message
				// TODO: Move the message to a full logs details tray/modal
			}
			<Col xs="12" className="mt-1">
				{/* {isObject(message) && message.error ? message.error : JSON.stringify(message).slice(1, -1)} */}
				<pre>
					<code>{isObject(message) ? JSON.stringify(message) : message}</code>
				</pre>
			</Col>
		</Row>
	);
}

export default LogsRow;
