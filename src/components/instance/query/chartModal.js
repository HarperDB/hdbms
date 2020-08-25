import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader, Button, Row, Col, Input } from 'reactstrap';
import SelectDropdown from 'react-select';
import Chart from 'react-apexcharts';
import { useParams } from 'react-router-dom';

import useDashboard from '../../../state/instanceDashboard';
import uuid from '../../../methods/util/uuid';

export default ({ setShowChartModal, tableData, query }) => {
  const [instanceDashboard, setInstanceDashboard] = useDashboard({});
  const { compute_stack_id } = useParams();
  const [chart, setChart] = useState({ type: 'line', labelAttribute: false, seriesAttributes: [], query, name: false, id: uuid() });
  const chartTypes = ['line', 'bar', 'pie', 'donut'];
  const attributes = Object.keys(tableData[0]);
  const showChart = chart.type && chart.seriesAttributes?.length && chart.labelAttribute;
  const excludeFromDataDropdown = [...chart.seriesAttributes, chart.labelAttribute, '__createdtime__', '__updatedtime__'];

  const setChartType = (type) => setChart({ ...chart, labelAttribute: false, seriesAttributes: [], type });

  const addLabelAttribute = (labelAttribute) => setChart({ ...chart, labelAttribute });

  const addSeriesAttribute = (attribute) => setChart({ ...chart, seriesAttributes: chart.type === 'pie' ? [attribute] : [...chart.seriesAttributes, attribute] });

  const removeSeriesAttribute = (attribute) => {
    const attributeIndex = chart.seriesAttributes.indexOf(attribute);
    chart.seriesAttributes.splice(attributeIndex, 1);
    setChart({ ...chart, seriesAttributes: chart.seriesAttributes });
  };

  const addChartToDashboard = () => {
    setInstanceDashboard({ ...instanceDashboard, [compute_stack_id]: instanceDashboard[compute_stack_id] ? [...instanceDashboard[compute_stack_id], chart] : [chart] });
    setTimeout(() => setShowChartModal(false), 0);
  };

  return (
    <Modal id="chart-modal" size="lg" isOpen toggle={() => setShowChartModal(false)}>
      <ModalHeader toggle={() => setShowChartModal(false)}>Create Chart From This Query Data</ModalHeader>
      <ModalBody>
        <Row>
          <Col xs="8">
            <Input type="text" placeholder="chart name" onChange={(e) => setChart({ ...chart, name: e.target.value })} />
          </Col>
          <Col xs="4">
            <Button onClick={addChartToDashboard} block disabled={!chart.type || !chart.labelAttribute || !chart.seriesAttributes.length || !chart.name} color="purple">
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
              options={chartTypes.map((c) => ({ label: `${c} chart`, value: c }))}
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
              value={chart.labelAttribute ? { label: `${['donut', 'pie'].includes(chart.type) ? 'label' : 'x-axis'}: ${chart.labelAttribute}`, value: chart.labelAttribute } : null}
              isSearchable={false}
              isClearable={false}
              isDisabled={!chart.type}
              placeholder={`${chart.type === 'pie' ? 'label' : 'x-axis'} column`}
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
              value={chart.type === 'pie' && chart.seriesAttributes.length ? { label: `data column: ${chart.seriesAttributes[0]}`, value: chart.seriesAttributes[0] } : null}
              isSearchable={false}
              isClearable={false}
              isDisabled={!chart.type}
              placeholder={`${['donut', 'pie'].includes(chart.type) ? 'select' : 'add'} data column`}
              styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
            />
          </Col>
        </Row>
        {!['donut', 'pie'].includes(chart.type) && chart.seriesAttributes.length ? (
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
              options={{
                chart: {
                  type: chart.type,
                  fontFamily: 'proxima-soft',
                  toolbar: { offsetX: -25, tools: { selection: false, pan: false, zoom: false, zoomin: false, zoomout: false, reset: false } },
                },
                title: { text: chart.name },
                labels: tableData.map((d) => d[chart.labelAttribute]),
                theme: { palette: 'palette10' },
                plotOptions: { pie: { offsetY: 10 } },
                legend: { offsetY: 15 },
              }}
              series={
                ['donut', 'pie'].includes(chart.type)
                  ? tableData.map((d) => d[chart.seriesAttributes[0]])
                  : chart.seriesAttributes.map((s) => ({ name: s, data: tableData.map((d) => d[s]) }))
              }
              type={chart.type}
              height={250}
            />
          ) : (
            <div className="text-center py-5 text-grey">please choose chart type, label, and data</div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};
