import { useEffect, useRef, useState } from 'react';
import { BOOKING } from '../lib/booking';

// The amount (₹99) and the post-payment redirect (→ /teach/booked) are set on
// this button in the Razorpay dashboard, not in code. See src/lib/booking.ts.
//
// The checkout opens in an iframe on the APEX domain
// (https://razorpay.com/payment-button/<id>/view), which `*.razorpay.com` does
// not match. The CSP in vercel.json must keep listing https://razorpay.com in
// frame-src, or clicking this button renders Chrome's "This content is blocked"
// page instead of the checkout.
const RAZORPAY_BUTTON_ID = BOOKING.razorpayButtonId;

const PaymentButton: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', RAZORPAY_BUTTON_ID);
    script.async = true;
    script.onload = () => setStatus('ready');
    script.onerror = () => setStatus('error');
    form.appendChild(script);

    return () => {
      form.innerHTML = '';
    };
  }, [attempt]);

  return (
    <div className="razorpay-button-container">
      <form ref={formRef} aria-label="Razorpay checkout" />
      <p className="razorpay-button-status" role="status" aria-live="polite">
        {status === 'loading' && 'Loading secure checkout…'}
        {status === 'error' && 'Secure checkout could not load.'}
      </p>
      {status === 'error' && (
        <button
          type="button"
          className="razorpay-button-retry"
          onClick={() => {
            setStatus('loading');
            setAttempt((value) => value + 1);
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default PaymentButton;
