import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import Logs from './Logs';
/*
logFilter object:
	limit: <number>
	level: 'notify' | 'error', | 'warn' | 'info' | 'debug' | 'trace'
	from: DATE (UTC) timestamp
	until: DATE (UTC) timestamp
	order: 'asc' | 'desc'
*/

const formatDate = (date) =>
	new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).format(date);

const isValidDateRange = (startDate, endDate) => {
	if (!startDate && !endDate) return true;
	if (!startDate || !endDate) return true;

	const start = new Date(startDate);
	const end = new Date(endDate);
	return start <= end;
};
const defaultFormState = {
	start: 0,
	limit: 1000,
	level: undefined,
	from: undefined,
	until: undefined,
	order: 'desc',
};
function LogsIndex() {
	const [logsFilter, setLogsFilter] = useState(defaultFormState);
	const alert = useAlert();
	const applyFilters = (event) => {
		event.preventDefault();
		if (!isValidDateRange(event.target.elements.logFromInput.value, event.target.elements.logUntilInput.value)) {
			alert.error('Please provide a valid date range.');
			return;
		}

		setLogsFilter({
			start: 0,
			limit: parseInt(event.target.elements.logLimitInput.value, 10) || 1000,
			level: event.target.elements.logLevelSelect.value || undefined,
			from: event.target.elements.logFromInput.value || undefined,
			until: event.target.elements.logUntilInput.value || undefined,
			order: 'desc',
		});
	};

	const resetForm = () => {
		const logsFilterForm = document.getElementById('logs-filter-form');
		setLogsFilter(defaultFormState);
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
					<input name="from" id="logFromInput" onChange={isValidDateRange} type="datetime-local" />
					<input name="until" id="logUntilInput" type="datetime-local" />
					<button type="submit">Apply</button>
					<button type="button" onClick={resetForm}>
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
