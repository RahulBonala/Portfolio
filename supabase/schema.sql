-- bookings table
create table if not exists public.bookings (
  razorpay_payment_id text unique not null,
  razorpay_payment_link_id text,
  email text,
  phone text,
  name text,
  amount_minor int,
  currency text default 'INR',
  status text,
  scheduled_at timestamptz,
  calendly_event_uri text,
  calendly_invitee_uri text,
  created_at timestamptz default now()
);

-- reviews table
--
-- `email` is optional and given for follow-up only (an offer, a later
-- session). It is never selected by /api/reviews, so it cannot be read back
-- out through the public endpoint.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  razorpay_payment_id text,
  display_name text not null,
  role text,
  email text,
  rating int not null check (rating between 1 and 5),
  body text not null,
  status text not null default 'approved',
  source text not null,
  submitter_hash text,
  created_at timestamptz default now()
);

-- For a database created before `email` existed: `create table if not exists`
-- above is a no-op on an existing table, so the column has to be added here.
alter table public.reviews add column if not exists email text;

create unique index if not exists reviews_payment_uniq on public.reviews (razorpay_payment_id) where razorpay_payment_id is not null;

-- contact_messages table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  user_agent text,
  created_at timestamptz default now()
);

-- Enable RLS to block anon key (API uses service_role key to bypass)
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;
