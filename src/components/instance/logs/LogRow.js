import React from 'react';
import { Row, Col } from 'reactstrap';

import isObject from '../../../functions/util/isObject';

function LogsRow({ onRowClick, level, timestamp, message, tags, thread }) {
	return (
		<Row xs="12" md="12" className="item-row" onClick={onRowClick}>
			<Col xs="2" md="1" className={`text-nowrap ${level?.toLowerCase()}`}>
				{level?.toUpperCase() || 'UNKNOWN'}
			</Col>
			<Col xs="2" md="2" className="">
				{new Date(timestamp || null).toLocaleDateString()}
			</Col>
			<Col xs="2" md="2" className="">
				{new Date(timestamp || null).toLocaleTimeString()}
			</Col>
			<Col xs="2" md="1" className="">
				{thread}
			</Col>
			<Col xs="2" md="2" className="">
				{tags?.join(', ')}
			</Col>
			<Col xs="2" md="4" className="">
				{isObject(message) && message.error ? (
					message.error
				) : (
					<pre>
						<code>{message}</code>
					</pre>
				)}
			</Col>
		</Row>
	);
}

export default LogsRow;
