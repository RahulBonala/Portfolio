import { Link } from 'react-router-dom';
import { BOOKING } from '../lib/booking';
import type { BookingAccess } from '../lib/payment';
import BookingSteps from './BookingSteps';
import ReviewForm from './ReviewForm';

type BookingConfirmedProps = {
  access: BookingAccess & { state: 'granted' };
  retrying: boolean;
  onRetry: () => void;
};

const BookingConfirmed: React.FC<BookingConfirmedProps> = ({ access, retrying, onRetry }) => {
  return (
    <>
      <Link to="/" className="page-back">← Back to portfolio</Link>

      <header className="teach-head">
        <div className="teach-head-copy">
          <p className="teach-eyebrow">Payment received</p>
          <h1 className="teach-title" data-reveal="up">Now pick your slot.</h1>
          <p className="teach-lede" data-reveal="up">
            Thanks, you’re all set on the payment side. Grab a time that works for you
            and we’ll meet 1:1 for the hour. You’ll get a calendar invite straight after.
          </p>
        </div>
      </header>

      <div data-reveal="up">
        <BookingSteps
          stage="paid"
          verified={access.verified}
          paymentId={access.paymentId}
          schedulingUrl={access.schedulingUrl}
          downloadToken={access.downloadToken}
          verificationIssue={access.verificationIssue}
          scheduled={access.scheduled}
          retrying={retrying}
          onRetry={onRetry}
        />
      </div>

      {access.downloadToken && (
        <div data-reveal="up">
          <ReviewForm token={access.downloadToken} />
        </div>
      )}

      <p className="teach-foot" data-reveal="up">
        Trouble with the scheduler, or need the Playbook again?{' '}
        <a href={`mailto:${BOOKING.email}`}>Email me</a> and I’ll sort it out.
      </p>
    </>
  );
};

export default BookingConfirmed;
