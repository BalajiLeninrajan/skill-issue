CREATE TABLE IF NOT EXISTS hope_registrations (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  scheduled_at INTEGER NOT NULL,
  sent_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scheduled ON hope_registrations(scheduled_at) WHERE sent_at IS NULL;
