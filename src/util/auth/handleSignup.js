import isEmail from '../isEmail';
import addCustomer from '../../api/lms/addCustomer';
import checkSubdomain from '../../api/lms/checkSubdomain';

export default async ({ formState, setFormState, formData }) => {
  const { submitted, processing } = formState;
  if (submitted && !processing) {
    const { firstname, lastname, email, customer_name, subdomain, coupon_code } = formData;

    if (!firstname || !lastname || !email || !customer_name || !subdomain) {
      setFormState({
        error: 'All fields must be filled out',
      });
      setTimeout(() => setFormState({}), 1000);
    } else if (!isEmail(email)) {
      setFormState({
        error: 'Please provide a valid email',
      });
      setTimeout(() => setFormState({}), 1000);
    } else {
      const subdomainResponse = await checkSubdomain({ payload: { subdomain } });

      if (subdomainResponse.result) {
        setFormState({
          error: 'Subdomain is not available',
        });
        setTimeout(() => {
          setFormState({});
        }, 1000);
      } else {
        setFormState({
          processing: true,
        });
        const response = await addCustomer({
          payload: {
            firstname,
            lastname,
            email,
            customer_name,
            subdomain,
            coupon_code,
          },
        });
        if (response.result === false) {
          setFormState({
            error: response.message,
          });
          setTimeout(() => {
            setFormState({});
          }, 1000);
        } else {
          setFormState({ success: true });
        }
      }
    }
  }
};
