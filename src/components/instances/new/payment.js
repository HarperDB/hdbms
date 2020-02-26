import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Card, CardBody } from '@nio/ui-kit';

import cardOptions from '../../../util/stripe/cardOptions';

export default ({ setPaymentInfo, instancePrice, instanceInterval }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    if (error) { elements.getElement('card').focus(); return; }
    if (cardComplete) setProcessing(true);

    const payload = await stripe.createPaymentMethod({ type: 'card', card: elements.getElement(CardElement) });
    setProcessing(false);

    if (payload.error) {
      setError(payload.error);
    } else {
      setPaymentMethod(payload.paymentMethod);
    }
  };

  return (
    <Card>
      <CardBody>
        {paymentMethod ? (
          <>
            <div className="new-instance-label">Card Added Successfully</div>
            <hr />
            Manage payment forms on your account page.
            <hr />
            <Button block color="purple" onClick={() => setPaymentInfo(paymentMethod)}>Next: Confirm Order Details</Button>
          </>
        ) : (
          <>
            <div className="new-instance-label">Credit Card Details</div><br />
            The instance type you selected has a cost of ${instancePrice}/{instanceInterval}. Please add a credit card to your account using the form below. If you registered using a promo code, your card will not be charged until your promo credits run out.
            <hr className="mt-4" />
            <CardElement options={cardOptions} onChange={(e) => { setError(e.error); setCardComplete(e.complete); }} />
            <hr className="mb-4" />
            <Button block color="purple" disabled={processing || !stripe} onClick={handleSubmit}>Add Card</Button>
            {error && <div className="text-danger mt-3">{error.message}</div>}
          </>
        )}
      </CardBody>
    </Card>
  );
};
