import { useEffect, useRef } from 'react';

const RAZORPAY_BUTTON_ID = 'pl_SZtl3NKr9FohLH';

const PaymentButton: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const form = document.createElement('form');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', RAZORPAY_BUTTON_ID);
    script.async = true;

    form.appendChild(script);
    container.appendChild(form);

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="razorpay-button-container" />;
};

export default PaymentButton;
