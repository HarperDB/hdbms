import React, { Fragment, useContext, useState, useEffect } from 'react';
import { FlowChartWithState } from '@mrblenny/react-flow-chart';
import { Modal, Row, Col, ModalBody, ModalHeader, ButtonGroup, Button } from '@nio/ui-kit';

import { HarperDBContext } from '../../providers/harperdb';
import useWindowSize from '../../util/useWindowSize';
import CustomLink from '../../components/fabric/customLink';
import CustomNode from '../../components/fabric/customNode';

export default () => {
  const { instances, structure } = useContext(HarperDBContext);
  const { width, height } = useWindowSize();
  const [flowChart, setFlowChart] = useState(false);
  const [activeClusteringObject, setActiveClusteringObject] = useState(false);

  const positions = {
    ClusterDemoA7: { x: width * 0.5 - 100, y: 20 },
    ClusterDemoA6: { x: width * 0.75 - 100, y: height * 0.30 },
    ClusterDemoA5: { x: width * 0.25 - 100, y: height * 0.30 },
    ClusterDemoA4: { x: width * 0.85 - 100, y: height * 0.65 },
    ClusterDemoA3: { x: width * 0.6 - 100, y: height * 0.65 },
    ClusterDemoA2: { x: width * 0.35 - 100, y: height * 0.65 },
    ClusterDemoA1: { x: width * 0.1 - 100, y: height * 0.65 },
  };

  const simpleStructure = {};
  Object.keys(structure).map((schema) => {
    simpleStructure[schema] = {};
    Object.keys(structure[schema]).map((table) => {
      simpleStructure[schema][table] = false;
    });
  });

  const handleClick = (e, link) => {
    e.stopPropagation();
    setActiveClusteringObject(link);
  };

  const buildChart = () => {
    const chart = { offset: { x: 0, y: 0 }, nodes: {}, links: {}, selected: {}, hovered: {} };
    instances.map((instance) => {
      const instanceTables = JSON.parse(JSON.stringify(simpleStructure));

      chart.nodes[instance.fabric.name] = {
        id: instance.fabric.name,
        type: 'output-only',
        position: positions[instance.fabric.name],
        ports: { out: { id: 'out', type: 'bottom' } },
      };

      instance.fabric.outbound_connections.map((o) => {
        o.subscriptions.map((s) => {
          const from = instance.fabric.name;
          const to = o.node_name;
          const linkId = `${from}-${to}`;
          const [schema, table] = s.channel.split(':');
          instanceTables[schema][table] = s.publish ? 'publish' : 'subscribe';
          chart.nodes[instance.fabric.name].tables = instanceTables;

          chart.links[linkId] = {
            id: linkId,
            from: { nodeId: from, portId: 'out' },
            to: { nodeId: to, portId: 'out' },
            tables: instanceTables,
          };
        });
      });
    });
    return chart;
  };

  useEffect(() => {
    setFlowChart(buildChart());
  }, []);

  return (
    <div id="fabric">
      {flowChart && (
        <FlowChartWithState
          initialValue={flowChart}
          Components={{
            NodeInner: (props) => CustomNode(props, simpleStructure),
            Link: (props) => CustomLink(props, handleClick),
          }}
        />
      )}
      {activeClusteringObject && (
        <Modal id="fabric-editor" isOpen={!!activeClusteringObject} scrollable toggle={() => setActiveClusteringObject(false)}>
          <ModalHeader toggle={() => setActiveClusteringObject(false)}>
            Configure Data Fabric
          </ModalHeader>
          <ModalBody>
            {Object.keys(activeClusteringObject.tables).sort().map((schema) => (
              <div key={schema} className="mb-4">
                <h6 className="mt-2">{schema}</h6>
                <hr className="my-2" />
                {Object.keys(activeClusteringObject.tables[schema]).sort().map((table) => (
                  <Fragment key={`${schema}${table}`}>
                    <Row>
                      <Col xs="3">
                        {table}
                      </Col>
                      <Col xs="3">
                        {activeClusteringObject.from.nodeId}
                      </Col>
                      <Col xs="3">
                        <ButtonGroup size="sm">
                          <Button size="sm" color="purple" outline={activeClusteringObject.tables[schema][table] !== 'subscribe'}><i className="fa fa-chevron-left" /></Button>
                          <Button size="sm" color="purple" outline={activeClusteringObject.tables[schema][table] !== 'publish'}><i className="fa fa-chevron-right" /></Button>
                        </ButtonGroup>
                      </Col>
                      <Col xs="3">
                        {activeClusteringObject.to.nodeId}
                      </Col>
                    </Row>
                    <hr className="my-2" />
                  </Fragment>
                ))}
              </div>
            ))}
          </ModalBody>
        </Modal>
      )}
    </div>
  );
};
