import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader, Button, Row, Col, Input } from 'reactstrap';
import SelectDropdown from 'react-select';
import Chart from 'react-apexcharts';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';
import addChart from '../../../api/lms/addChart';
import chartOptions from '../../../methods/instance/chartOptions';
import chartTypes from '../../../methods/instance/chartTypes';

export default ({ setShowChartModal, tableData, query }) => {
  const { compute_stack_id, customer_id } = useParams();
  const auth = useStoreState(appState, (s) => s.auth);
  const [chart, setChart] = useState({ customer_id, compute_stack_id, name: false, type: 'line', query, labelAttribute: false, seriesAttributes: [], shared: false });
  const attributes = Object.keys(tableData[0]);
  const showChart = chart.type && chart.seriesAttributes?.length && chart.labelAttribute;
  const excludeFromDataDropdown = [...chart.seriesAttributes, chart.labelAttribute, '__createdtime__', '__updatedtime__'];
  const singleSeriesAttribute = chartTypes
    .filter((t) => t.singleSeriesAttribute)
    .map((t) => t.type)
    .includes(chart.type);
  const options = chartOptions({ type: chart.type, labels: tableData.map((d) => d[chart.labelAttribute]) });
  const setChartType = (type) => {
    const shapeChange = chartTypes.find((t) => t.type === type).singleSeriesAttribute !== chartTypes.find((t) => t.type === chart.type).singleSeriesAttribute;
    setChart(shapeChange ? { ...chart, labelAttribute: false, seriesAttributes: [], type } : { ...chart, type });
  };
  const addLabelAttribute = (labelAttribute) => setChart({ ...chart, labelAttribute });
  const addSeriesAttribute = (attribute) => setChart({ ...chart, seriesAttributes: singleSeriesAttribute ? [attribute] : [...chart.seriesAttributes, attribute] });
  const removeSeriesAttribute = (attribute) => {
    const attributeIndex = chart.seriesAttributes.indexOf(attribute);
    chart.seriesAttributes.splice(attributeIndex, 1);
    setChart({ ...chart, seriesAttributes: chart.seriesAttributes });
  };

  return (
    <Modal id="chart-modal" size="lg" isOpen toggle={() => setShowChartModal(false)}>
      <ModalHeader toggle={() => setShowChartModal(false)}>Create Chart From This Query Data</ModalHeader>
      <ModalBody>
        <Row>
          <Col xs="4">
            <Input id="chart_name" type="text" placeholder="chart name" onChange={(e) => setChart({ ...chart, name: e.target.value })} />
          </Col>
          <Col xs="4" className="text-nowrap d-flex justify-content-center align-items-center">
            <Button className="mr-2" color="link" onClick={() => setChart({ ...chart, shared: !chart.shared })}>
              <i className={`fa fa-lg text-purple fa-toggle-${chart.shared ? 'on' : 'off'}`} />
            </Button>
            visible to all instance users
          </Col>
          <Col xs="4">
            <Button
              onClick={() => addChart({ auth, ...chart })}
              block
              disabled={!chart.type || !chart.labelAttribute || !chart.seriesAttributes.length || !chart.name}
              color="purple"
            >
              Add To Dashboard
            </Button>
          </Col>
          <Col xs="12">
            <hr className="my-2" />
          </Col>
          <Col xs="4">
            <SelectDropdown
              className="react-select-container"
              classNamePrefix="react-select"
              onChange={({ value }) => setChartType(value)}
              options={chartTypes.map((c) => ({ label: `${c.type} chart`, value: c.type }))}
              value={{ label: `chart type: ${chart.type} chart`, value: chart.type }}
              isSearchable={false}
              isClearable={false}
              placeholder="Chart Type"
              styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
            />
          </Col>
          <Col xs="4">
            <SelectDropdown
              className="react-select-container"
              classNamePrefix="react-select"
              onChange={({ value }) => addLabelAttribute(value)}
              options={attributes
                .filter((a) => !['__createdtime__', '__updatedtime__'].includes(a))
                .sort()
                .map((a) => ({ label: a, value: a }))}
              value={chart.labelAttribute ? { label: `${singleSeriesAttribute ? 'label' : 'x-axis'}: ${chart.labelAttribute}`, value: chart.labelAttribute } : null}
              isSearchable={false}
              isClearable={false}
              isDisabled={!chart.type}
              placeholder={`${singleSeriesAttribute ? 'label' : 'x-axis'} column`}
              styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
            />
          </Col>
          <Col xs="4">
            <SelectDropdown
              className="react-select-container"
              classNamePrefix="react-select"
              onChange={({ value }) => addSeriesAttribute(value)}
              options={attributes
                .filter((a) => !excludeFromDataDropdown.includes(a))
                .sort()
                .map((a) => ({ label: a, value: a }))}
              value={singleSeriesAttribute && chart.seriesAttributes.length ? { label: `data column: ${chart.seriesAttributes[0]}`, value: chart.seriesAttributes[0] } : null}
              isSearchable={false}
              isClearable={false}
              isDisabled={!chart.type}
              placeholder={`${singleSeriesAttribute ? 'select' : 'add'} data column`}
              styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
            />
          </Col>
        </Row>
        {!singleSeriesAttribute && chart.seriesAttributes.length ? (
          <>
            <hr className="my-2" />
            <div className="">
              {chart.seriesAttributes.map((a) => (
                <Button color="danger" size="sm" className="mr-2" onClick={() => removeSeriesAttribute(a)} key={a}>
                  [x] {a}
                </Button>
              ))}
            </div>
          </>
        ) : null}
        <hr className="my-2" />
        <div className="chart-holder">
          {showChart ? (
            <Chart
              options={options}
              series={
                singleSeriesAttribute ? tableData.map((d) => d[chart.seriesAttributes[0]]) : chart.seriesAttributes.map((s) => ({ name: s, data: tableData.map((d) => d[s]) }))
              }
              type={chart.type}
              height={250}
            />
          ) : (
            <div className="text-center py-5 text-grey">please choose chart {!chart.type && 'type, '}label and data</div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};
