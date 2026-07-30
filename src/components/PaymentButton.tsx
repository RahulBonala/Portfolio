import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', RAZORPAY_BUTTON_ID);
    script.async = true;
    form.appendChild(script);

    return () => {
      form.innerHTML = '';
    };
  }, []);

  return (
    <div className="razorpay-button-container">
      <form ref={formRef} />
    </div>
  );
};

export default PaymentButton;
