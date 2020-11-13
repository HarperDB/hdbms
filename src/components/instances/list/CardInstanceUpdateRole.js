import { Button } from 'reactstrap';
import React from 'react';

const CardInstanceUpdateRole = ({ formState, setFormState, setFormData = false }) => (
  <>
    {formState.error.split('.').map((text) =>
      text.length ? (
        <div key={text} className="text-small text-bold text-danger mb-2">
          {text.replace(' in HarperDB Studio', ' as a Super User')}.
        </div>
      ) : null
    )}
    <Button
      onClick={() => {
        if (setFormData) setFormData({});
        setFormState({});
      }}
      title="I understand"
      block
      color="danger"
      className="mt-3"
      disabled={formState.submitted}
    >
      OK, Got It
    </Button>
  </>
);

export default CardInstanceUpdateRole;
