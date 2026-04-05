import React from 'react';

interface PaymentButtonProps {
  paymentLink: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ paymentLink }) => {
  return (
    <a href={paymentLink} className="course-pay-btn" rel="noopener noreferrer">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      Pay ₹49 & Book Your Slot
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </a>
  );
};

export default PaymentButton;
