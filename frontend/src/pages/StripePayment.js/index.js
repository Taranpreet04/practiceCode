// import React from 'react'

// const StripePayment = () => {
//   return (
//     <div>StripePayment</div>
//   )
// }
// export default StripePayment;



// client/src/Checkout.jsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!stripe || !elements) return;

  //   setIsLoading(true);
  //   const { error } = await stripe.confirmPayment({
  //     elements,
  //     confirmParams: {
  //       // Return URL only needed for redirects (e.g., 3DS). For SPA, you can handle result here.
  //       return_url: window.location.origin + '/payment-result',
  //     },
  //     redirect: 'if_required'
  //   });

  //   if (error) {
  //     setMessage(error.message);
  //   } else {
  //     setMessage('Payment processing — check status in dashboard or handle webhook.');
  //   }
  //   setIsLoading(false);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    // Get the PaymentIntent client secret from elements
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message);
      setIsLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    console.log("paymentIntent--", paymentIntent)
    console.log("error--", error)
    
    if (error) {
      setMessage(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      setMessage('✅ Payment successful!');
    } else if (paymentIntent.status === 'processing') {
      setMessage('⏳ Payment is processing...');
    } else if (paymentIntent.status === 'requires_payment_method') {
      setMessage('❌ Payment failed. Please try again.');
    } else {
      setMessage(`⚠️ Unexpected status: ${paymentIntent.status}`);
    }

    setIsLoading(false);
  };


  console.log("stripePromise--", stripePromise, clientSecret)
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={isLoading || !stripe}>Pay</button>
      {message && <div>{message}</div>}
    </form>
  );
}

export default function StripePayment() {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // Create PaymentIntent on every visit or when user chooses amount
    fetch(`${process.env.REACT_APP_BASE_URL}/stripe/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 2500 }) // $25.00 in cents
    })
      .then(r => r.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  const options = clientSecret ? { clientSecret } : null;

  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  ) : (
    <div>Loading...</div>
  );
}
