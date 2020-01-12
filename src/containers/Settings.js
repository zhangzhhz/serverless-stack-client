import React, { useState } from 'react';
import { API } from 'aws-amplify';
import { Elements, StripeProvider } from "react-stripe-elements";
import BillingForm from '../components/BillingForm';
import config from '../config';
import './Settings.css';

export default function Settings(props) {
  const [isLoading, setIsLoading] = useState(false);

  function billUser(details) {
    return API.post('notes', '/billing', {
      body: details
    })
  }

  async function handleFormSubmit(storage, {token, error}) {
    if (error) {
      console.error(`ERROR: [${JSON.stringify(error, null, 4)}]`);
      alert(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id
      });
      console.log(`Your card has been charged successfully`);
      alert("Your card has been charged successfully");
      setIsLoading(false);
      props.history.push('/');
    }
    catch (e) {
      console.error(`ERROR: [${JSON.stringify(e, null, 4)}]`);
      alert(e);
      setIsLoading(false);
    }
  }

  return (
    <div className='Settings'>
      <StripeProvider apiKey={config.STRIPE_KEY}>
        <Elements>
          <BillingForm
            isLoading={isLoading}
            onSubmit={handleFormSubmit}
          />
        </Elements>
      </StripeProvider>
    </div>
  );
}