import React from 'react';
import { Col, Row } from 'reactstrap';
import Logs from './Logs';

function LogsIndex() {
	return (
		<Row id="logs">
			<Col lg="2" xs="12">
				<p>Logs Sidebar</p>
			</Col>
			<Col lg="10" xs="12">
				<Logs />
			</Col>
		</Row>
	);
}

export default LogsIndex;
