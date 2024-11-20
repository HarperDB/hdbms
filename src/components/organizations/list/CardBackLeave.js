import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Row, Col } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';
import appState from '../../../functions/state/appState';
import updateUserOrgs from '../../../functions/api/lms/updateUserOrgs';
import getUser from '../../../functions/api/lms/getUser';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
function CardBackLeave({
  customerId,
  customerName,
  setFlipState,
  flipState
}) {
  const alert = useAlert();
  const auth = useStoreState(appState, s => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  useAsyncEffect(async () => {
    const {
      submitted
    } = formState;
    if (submitted) {
      const {
        deleteCustomerName
      } = formData;
      if (customerName.toString() !== deleteCustomerName?.toString()) {
        setFormState({
          error: 'organization name is not correct'
        });
      } else {
        const response = await updateUserOrgs({
          auth,
          customerId,
          userId: auth.userId,
          status: 'removed'
        });
        if (response.error) {
          alert.error(response.message);
        } else {
          await getUser(auth);
          alert.success(`Organization removed from your profile successfully`);
        }
      }
    }
  }, [formState]);
  return <ErrorBoundary onError={(error, componentStack) => addError({
    error: {
      message: error.message,
      componentStack
    },
    customerId
  })} FallbackComponent={ErrorFallback}>
      <Card className="instance">
        {flipState &&
      // don't render the forms unless the card is flipped, as the autocomplete icon shows through
      <CardBody>
            <ul className="text-small my-0 text-nowrap">
              <li>
                <b>YOU</b> will be removed from the org.
              </li>
              <li>
                <b>THE ORG</b> will not be removed.
              </li>
            </ul>

            <Input id="customer_name" onChange={e => setFormData({
          deleteCustomerName: e.target.value
        })} type="text" title="customer name" className="my-3" placeholder={`Enter "${customerName}" here to confirm.`} value={formData.customerName} />
            <Row>
              <Col>
                <Button onClick={() => setFlipState(false)} title="Cancel" block disabled={formState.submitted} color="grey">
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button onClick={() => setFormState({
              submitted: true
            })} title="Confirm Organization Details" block disabled={formState.submitted || customerName?.toString() !== formData.deleteCustomerName?.toString()} color="danger">
                  {formState.submitted ? <i className="fa fa-spinner fa-spin" /> : <span>Do It</span>}
                </Button>
              </Col>
            </Row>
          </CardBody>}
      </Card>
    </ErrorBoundary>;
}
export default CardBackLeave;