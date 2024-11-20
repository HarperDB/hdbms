import React, { useMemo, useState } from 'react';
import { Button, Card, CardBody, Input, Row, Col } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import removeInstance from '../../../functions/api/lms/removeInstance';
import appState from '../../../functions/state/appState';
import useInstanceAuth from '../../../functions/state/instanceAuths';
import getInstances from '../../../functions/api/lms/getInstances';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
import getUser from '../../../functions/api/lms/getUser';
function CardBackDelete({
  computeStackId,
  instanceName,
  isLocal,
  setFlipState,
  flipState,
  wavelengthZoneId,
  cloudProvider
}) {
  const alert = useAlert();
  const {
    customerId
  } = useParams();
  const auth = useStoreState(appState, s => s.auth);
  const products = useStoreState(appState, s => s.products);
  const regions = useStoreState(appState, s => s.regions);
  const subscriptions = useStoreState(appState, s => s.subscriptions);
  const instances = useStoreState(appState, s => s.instances);
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = useMemo(() => instanceAuths && instanceAuths[computeStackId], [instanceAuths, computeStackId]);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  useAsyncEffect(async () => {
    const {
      submitted
    } = formState;
    if (submitted) {
      const {
        deleteInstanceName
      } = formData;
      if (instanceName.toString() !== deleteInstanceName?.toString()) {
        setFormState({
          error: 'instance name is not correct'
        });
      } else {
        const response = await removeInstance({
          auth,
          customerId,
          computeStackId,
          isVerizon: !!wavelengthZoneId,
          isAkamai: cloudProvider === 'akamai'
        });
        if (response.error) {
          alert.error('There was an error removing your instance. Please try again later.');
          setFormState({});
          setFormData({});
          setFlipState(false);
        } else {
          if (instanceAuth) setInstanceAuths({
            ...instanceAuths,
            [computeStackId]: false
          });
          setTimeout(() => {
            alert.success('Instance deletion complete');
            getInstances({
              auth,
              customerId,
              products,
              regions,
              subscriptions,
              instanceCount: instances?.length
            });
            getUser(auth);
          }, 100);
        }
      }
    }
  }, [formState]);
  return <ErrorBoundary onError={(error, componentStack) => addError({
    error: {
      message: error.message,
      componentStack
    }
  })} FallbackComponent={ErrorFallback}>
      <Card className="instance">
        {flipState &&
      // don't render the forms unless the card is flipped, as the autocomplete icon shows through
      <CardBody>
            {isLocal ? <ul className="text-small my-0 text-nowrap">
                <li>
                  <b>DOES NOT</b> uninstall HarperDB.
                </li>
                <li>
                  <b>DOES</b> leave all your data intact.
                </li>
              </ul> : <ul className="text-small my-0 text-nowrap">
                <li>
                  <b>THIS IS</b> an irreversible process.
                </li>
                <li>
                  <b>IT CANNOT</b> be undone.
                </li>
              </ul>}
            <Input id="instance_name" onChange={e => setFormData({
          deleteInstanceName: e.target.value
        })} type="text" title="instance_name" className="my-3" placeholder={`Enter "${instanceName}" here to confirm.`} value={formData.instanceName} />
            <Row>
              <Col>
                <Button onClick={() => setFlipState(false)} title="Cancel" block disabled={formState.submitted} color="grey">
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button onClick={() => setFormState({
              submitted: true
            })} title="Confirm Instance Details" block disabled={formState.submitted || instanceName?.toString() !== formData.deleteInstanceName?.toString()} color="danger">
                  {formState.submitted ? <i className="fa fa-spinner fa-spin" /> : <span>Do It</span>}
                </Button>
              </Col>
            </Row>
          </CardBody>}
      </Card>
    </ErrorBoundary>;
}
export default CardBackDelete;