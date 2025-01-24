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
		</Row>
	);
}

export default LogsRow;
