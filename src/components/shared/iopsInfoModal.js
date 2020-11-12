import React, { useState } from 'react';
import { Button, Card, CardBody, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

const IopsInfoModal = ({ iops }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <i tabIndex={0} role="button" onMouseDown={setIsOpen} className="fa fa-info-circle text-purple" />
      <Modal isOpen={!!isOpen} toggle={() => setIsOpen(false)} centered fade={false} scrollable>
        <ModalHeader toggle={() => setIsOpen(false)}>Disk IOPS Primer</ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <div className="text-bold mb-3">What are IOPS?</div>
              <ul>
                <li>IOPS stands for Input/Output Per Second, and are based on your Disk Volume Size</li>
                <li>This instance has a limit of {iops} IOPS</li>
                <li>
                  <b>To increase IOPS, you must increase your Disk Volume Size</b>
                </li>
              </ul>

              <hr className="my-3" />

              <div className="text-bold mb-3">What are Burst Credits?</div>
              <ul>
                <li>Burst Credits allow for occasional IOPS &quot;bursts&quot;</li>
                <li>You have Credits good for 30 minutes @ 3000 IOPS</li>
                <li>Once your Credits are depleted, you are limited to {100} IOPS</li>
                <li>Credits accumulate at a rate of 3 IOPS per GB of Disk Volume per second when you operate under your {iops} IOPS limit</li>
                <li>
                  If you consistently use {iops} IOPS after depleting your Credits, you&apos;ll be limited to {iops} IOPS in perpetuity
                </li>
              </ul>

              <hr className="my-3" />

              <div className="text-bold mb-3">Why should I care?</div>
              <ul>
                <li>Databases are VERY I/O intensive</li>
                <li>HarperDB&apos;s FREE tier has LIMITED IOPS</li>
                <li>You are guaranteed at least {iops} IOPS, but for large data sets you can hit that limit VERY quickly.</li>
                <li>Hitting your IOPS limit can make HarperDB seem slow</li>
                <li>If HarperDB seems slow, you may feel unhappy</li>
                <li>We want you to be happy</li>
              </ul>
              <hr className="my-3" />

              <div className="text-bold mb-3">Where can I lear more?</div>
              <ul>
                <li>
                  <a href="https://harperdb.io/developers/documentation/harperdb-cloud/iops-impact-on-performance/" target="_blank" rel="noopener noreferrer">
                    Learn more about IOPS impact on performance
                  </a>
                </li>
                <li>
                  <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html" target="_blank" rel="noopener noreferrer">
                    Read more about AWS IOPS limits
                  </a>
                  &nbsp;(we use AWS gp2 SSDs)
                </li>
              </ul>
            </CardBody>
          </Card>
        </ModalBody>
      </Modal>
    </>
  );
};

export default IopsInfoModal;
