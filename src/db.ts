export interface HopeRegistration {
  id: string;
  email: string;
  company_name: string;
  job_title: string;
  scheduled_at: number;
  sent_at: number | null;
  created_at: number;
}

export async function insertHope(
  db: D1Database,
  id: string,
  email: string,
  companyName: string,
  jobTitle: string,
  scheduledAt: number
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  await db
    .prepare(
      `INSERT INTO hope_registrations (id, email, company_name, job_title, scheduled_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(id, email, companyName, jobTitle, scheduledAt, now)
    .run();
}

export async function getPendingRejections(db: D1Database): Promise<HopeRegistration[]> {
  const now = Math.floor(Date.now() / 1000);
  const result = await db
    .prepare(
      `SELECT * FROM hope_registrations WHERE scheduled_at <= ? AND sent_at IS NULL LIMIT 50`
    )
    .bind(now)
    .all<HopeRegistration>();
  return result.results;
}

export async function markAsSent(db: D1Database, id: string): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  await db
    .prepare(`UPDATE hope_registrations SET sent_at = ? WHERE id = ?`)
    .bind(now, id)
    .run();
}
