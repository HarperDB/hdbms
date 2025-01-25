import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import Logs from './Logs';
/*
logFilter object:
	limit: <number>
	level: 'notify' | 'error', | 'warn' | 'info' | 'debug' | 'trace'
	from: DATE (UTC) timestamp
	until: DATE (UTC) timestamp
	order: 'asc' | 'desc'
*/
function LogsIndex() {
	const [logsFilter, setLogsFilter] = useState({});
	const applyFilters = (event) => {
		event.preventDefault();
		setLogsFilter({
			limit: event.target.elements.logLimitInput.value,
			level: event.target.elements.logLevelSelect.value,
		});
	};

	const resetForm = () => {
		const logsFilterForm = document.getElementById('logs-filter-form');
		setLogsFilter({});
		logsFilterForm.reset();
	};
	return (
		<Row id="logs">
			<Col lg="2" xs="12">
				<h3>Filters</h3>
				<form onSubmit={applyFilters} id="logs-filter-form">
					<input name="limit" id="logLimitInput" type="number" max={1000} min={1} placeholder="Log Limit" />
					<select name="level" id="logLevelSelect">
						<option hidden disabled value>
							{' '}
							-- Select a log level --{' '}
						</option>
						<option />
						<option value="notify">Notify</option>
						<option value="error">Error</option>
						<option value="warn">Warn</option>
						<option value="info">Info</option>
						<option value="debug">Debug</option>
						<option value="trace">Trace</option>
					</select>
					{/* <input name="from" id="log-from" type='datetime-local' />
					<input name="until" id="log-until" type='datetime-local' /> */}
					<button type="submit">Apply</button>
					<button type="reset" onClick={resetForm}>
						Reset
					</button>
				</form>
			</Col>
			<Col lg="10" xs="12">
				<Logs logsFilter={logsFilter} />
			</Col>
		</Row>
	);
}

export default LogsIndex;
