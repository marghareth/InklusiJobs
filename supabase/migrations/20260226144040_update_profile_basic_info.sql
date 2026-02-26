ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS age SMALLINT CHECK (age > 0 AND age < 120),
  ADD COLUMN IF NOT EXISTS current_address TEXT,
  ADD COLUMN IF NOT EXISTS permanent_address TEXT,
  ADD COLUMN IF NOT EXISTS contact_number TEXT,
  ADD COLUMN IF NOT EXISTS educational_attainment TEXT CHECK (educational_attainment IN (
    'Some Elementary',
    'Elementary Graduate',
    'Some High School',
    'High School Graduate',
    'Some College',
    'College Graduate',
    'Some/Completed Master''s Degree',
    'Master''s Graduate',
    'Vocational/TVET'
  ));