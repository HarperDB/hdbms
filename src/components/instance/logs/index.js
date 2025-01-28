import React, { useState, useRef } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';
import Select from 'react-select';
import { useAlert } from 'react-alert';
import Logs from './Logs';

const isValidDateRange = (startDate, endDate) => {
	if (!startDate && !endDate) return true;
	if (!startDate || !endDate) return true;

	const start = new Date(startDate);
	const end = new Date(endDate);
	return start <= end;
};
/*
logFilter object:
 limit: 1000 | 500 | 250 | 100 | 10 || 1000
 level: 'notify' | 'error', | 'warn' | 'info' | 'debug' | 'trace' || undefined
 from: DATE (UTC) timestamp || undefined
 until: DATE (UTC) timestamp || undefined
*/
const defaultFormState = {
	limit: 1000,
	level: undefined,
	from: undefined,
	until: undefined,
};
function LogsIndex() {
	const [logsFilter, setLogsFilter] = useState(defaultFormState);
	const logsFilterFormRef = useRef();
	const logLimitSelectRef = useRef();
	const logLevelSelectRef = useRef();
	const alert = useAlert();
	const applyFilters = (event) => {
		event.preventDefault();

		if (!isValidDateRange(event.target.elements.logFromInput.value, event.target.elements.logUntilInput.value)) {
			alert.error('Please provide a valid date range.');
			return;
		}

		setLogsFilter({
			limit: event.target.elements.logLimitSelect.value || 1000,
			level: event.target.elements.logLevelSelect.value || undefined,
			from: event.target.elements.logFromInput.value || undefined,
			until: event.target.elements.logUntilInput.value || undefined,
		});
	};

	const resetForm = () => {
		logsFilterFormRef.current.reset();
		logLimitSelectRef.current.clearValue();
		logLevelSelectRef.current.clearValue();
		setLogsFilter(defaultFormState);
	};
	return (
		<Row id="logs">
			<Col lg="2" xs="12">
				<h2 className="mb-3 filters-header">Log Filters</h2>
				<form onSubmit={applyFilters} ref={logsFilterFormRef}>
					<Select
						name="logLimitSelect"
						ref={logLimitSelectRef}
						placeholder="Log Limit"
						isSearchable={false}
						options={[
							{ value: 1000, label: '1000' },
							{ value: 500, label: '500' },
							{ value: 250, label: '250' },
							{ value: 100, label: '100' },
							{ value: 10, label: '10' },
						]}
					/>
					<Select
						name="logLevelSelect"
						isSearchable={false}
						className="mt-3"
						ref={logLevelSelectRef}
						placeholder="Log Level"
						defaultValue={null}
						options={[
							{ value: null, label: 'All' },
							{ value: 'notify', label: 'Notify' },
							{ value: 'error', label: 'Error' },
							{ value: 'warn', label: 'Warn' },
							{ value: 'info', label: 'Info' },
							{ value: 'debug', label: 'Debug' },
							{ value: 'trace', label: 'Trace' },
						]}
					/>

					<Input name="logFromInput" type="datetime-local" className="mt-3" />
					<Input name="logUntilInput" type="datetime-local" className="mt-3" />
					<div className=" mt-3">
						<Button type="submit" className="btn btn-purple px-4 w-100">
							Apply
						</Button>
						<Button type="button" className="btn btn-purple px-4 w-100 mt-3" onClick={resetForm}>
							Reset
						</Button>
					</div>
				</form>
			</Col>
			<Col lg="10" xs="12">
				<Logs logsFilter={logsFilter} />
			</Col>
		</Row>
	);
}

export default LogsIndex;
