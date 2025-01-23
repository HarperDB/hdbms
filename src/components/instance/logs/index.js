import React from 'react';
import { Col, Row } from 'reactstrap';
import Logs from './Logs';

function LogsIndex() {
	return (
		<Row id="logs">
			<Col lg="2" xs="12">
				<h1>Logs Sidebar</h1>
			</Col>
			<Col lg="10" xs="12">
				<Logs />
			</Col>
		</Row>
	);
}

export default LogsIndex;
