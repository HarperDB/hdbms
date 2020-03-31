import React, { useEffect, Fragment } from 'react';
import { useStoreState } from 'pullstate';
import { Row, Col } from '@nio/ui-kit';

import getProducts from '../../api/lms/getProducts';
import appState from '../../state/stores/appState';

import commaNumbers from '../../util/commaNumbers';

export default () => {
  const products = useStoreState(appState, (s) => s.products);

  useEffect(() => {
    getProducts();
  }, []);

  const getLocalPrice = (ram) => {
    const localRAMEquivalent = products.localCompute.find((l) => l.ram_allocation === ram);
    return !localRAMEquivalent ? '-' : localRAMEquivalent.price === 'FREE' ? 'FREE' : `$${commaNumbers(localRAMEquivalent.price)}`;
  };

  return (
    <div id="standalone">
      <hr className="mt-0 mb-2" />
      <Row>
        <Col xs="4" className="px-4 text-nowrap">
          <b>RAM (GB)</b>
        </Col>
        <Col xs="4" className="px-4 text-nowrap">
          <b>HarperDB Cloud (Monthly)*</b>
        </Col>
        <Col xs="4" className="px-4 text-nowrap">
          <b>Self-Hosted (Annual)</b>
        </Col>
      </Row>
      <hr className="my-2" />
      {products ? products.cloudCompute.map((p, i) => (
        <Fragment key={i}>
          <Row>
            <Col xs="4" className="px-4 text-nowrap">
              {p.ram_allocation === 1024 ? 'Up To ' : ''}{p.ram_allocation / 1024}
            </Col>
            <Col xs="4" className="px-4 text-nowrap">
              {p.price === 'FREE' ? 'FREE' : `$${commaNumbers(p.price)}`}
            </Col>
            <Col xs="4" className="px-4 text-nowrap">
              {getLocalPrice(p.ram_allocation)}
            </Col>
          </Row>
          <hr className="my-2" />
        </Fragment>
      )) : (
        <div className="p-4 text-center text-small">
          <i className="fa fa-spinner fa-spin text-purple mb-4" /><br />
          The Chief Fur Officer is fetching the price sheet.
        </div>
      )}
    </div>
  );
};
