import React, { useCallback } from 'react';

interface PaymentButtonProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ amount, onSuccess }) => {
  const handlePayment = useCallback(async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Payment gateway failed to load. Please check your connection and try again.');
      return;
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // TODO: Replace with your Razorpay Key ID
      amount,
      currency: 'INR',
      name: 'Zero to Live Project with AI',
      description: '1-Hour Design Session — Bouquet Slot',
      image: '/assets/course-poster.png',
      handler: function (response: { razorpay_payment_id: string }) {
        localStorage.setItem('coursePaid', 'true');
        onSuccess(response.razorpay_payment_id);
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#6C63FF',
      },
      modal: {
        ondismiss: function () {
          // user closed checkout without paying
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }, [amount, onSuccess]);

  return (
    <button className="course-pay-btn" onClick={handlePayment}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      Pay to Reserve Your Slot
    </button>
  );
};

export default PaymentButton;
