import React, { useEffect, Fragment } from 'react';
import { useStoreState } from 'pullstate';
import { Row, Col } from '@nio/ui-kit';

import getProducts from '../../api/lms/getProducts';
import appState from '../../state/appState';

export default () => {
  const products = useStoreState(appState, (s) => s.products);

  useEffect(() => {
    getProducts();
  }, []);

  const getLocalPrice = (ram) => {
    const localRAMEquivalent = products.localCompute.find((l) => l.ram_allocation === ram);
    return !localRAMEquivalent ? '-' : localRAMEquivalent.priceString;
  };

  return (
    <div id="standalone">
      <hr className="mt-0 mb-2" />
      <div className="d-none d-md-block">
        <Row>
          <Col xs="4" className="px-4 text-nowrap">
            <b>RAM (GB)</b>
          </Col>
          <Col xs="4" className="px-4 text-nowrap">
            <b>HarperDB Cloud (Monthly)</b>
          </Col>
          <Col xs="4" className="px-4 text-nowrap">
            <b>Self-Hosted (Annual)</b>
          </Col>
        </Row>
        <hr className="my-2" />
        {products ? (
          products.cloudCompute.map((p) => (
            <Fragment key={p.ram_allocation}>
              <Row>
                <Col xs="4" className="px-4 text-nowrap">
                  {p.ram_allocation === 1024 ? 'Up To ' : ''}
                  {p.ram_allocation / 1024}
                </Col>
                <Col xs="4" className="px-4 text-nowrap">
                  {p.priceString}
                </Col>
                <Col xs="4" className="px-4 text-nowrap">
                  {getLocalPrice(p.ram_allocation)}
                </Col>
              </Row>
              <hr className="my-2" />
            </Fragment>
          ))
        ) : (
          <div className="p-4 text-center text-small">
            <i className="fa fa-spinner fa-spin text-purple mb-4" />
            <br />
            The Chief Fur Officer is fetching the price sheet.
          </div>
        )}
      </div>
      <div className="d-block d-md-none">
        {products ? (
          <>
            <Row>
              <Col xs="12" className="px-4 pb-2 text-nowrap">
                <h5>HarperDB Cloud</h5>
              </Col>
              <Col xs="6" className="px-4 text-nowrap">
                <b>RAM (GB)</b>
              </Col>
              <Col xs="6" className="px-4 text-nowrap">
                <b>Monthly Cost</b>
              </Col>
            </Row>
            <hr className="my-2" />
            {products.cloudCompute.map((p) => (
              <Fragment key={p.ram_allocation}>
                <Row>
                  <Col xs="6" className="px-4 text-nowrap">
                    {p.ram_allocation === 1024 ? 'Up To ' : ''}
                    {p.ram_allocation / 1024}
                  </Col>
                  <Col xs="6" className="px-4 text-nowrap">
                    {p.priceString}
                  </Col>
                </Row>
                <hr className="my-2" />
              </Fragment>
            ))}
            <Row>
              <Col xs="12" className="px-4 pt-3 pb-2 text-nowrap">
                <h5>Self-Hosted</h5>
              </Col>
              <Col xs="6" className="px-4 text-nowrap">
                <b>RAM (GB)</b>
              </Col>
              <Col xs="6" className="px-4 text-nowrap">
                <b>Annual Cost</b>
              </Col>
            </Row>
            <hr className="my-2" />
            {products.cloudCompute.map((p) => (
              <Fragment key={p.ram_allocation}>
                <Row>
                  <Col xs="6" className="px-4 text-nowrap">
                    {p.ram_allocation === 1024 ? 'Up To ' : ''}
                    {p.ram_allocation / 1024}
                  </Col>
                  <Col xs="6" className="px-4 text-nowrap">
                    {getLocalPrice(p.ram_allocation)}
                  </Col>
                </Row>
                <hr className="my-2" />
              </Fragment>
            ))}
          </>
        ) : (
          <div className="p-4 text-center text-small">
            <i className="fa fa-spinner fa-spin text-purple mb-4" />
            <br />
            The Chief Fur Officer is fetching the price sheet.
          </div>
        )}
      </div>
    </div>
  );
};
